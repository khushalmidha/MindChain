import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import SoulTokenABI from "./ABI/SoulToken.json"; // Import the ABI

function Sample() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [uContract, setUContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [time,setTime] = useState(null);
  const [amountToReduce, setAmountToReduce]=useState(null)

  const soulTokenAddress = "0x0848590E57E255Ad63F774559F54F5BDa21Ec648"; // Replace with your contract address

  // On mount, load the provider and connect wallet


  const loadProvider = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(soulTokenAddress, SoulTokenABI, signer);
      setUContract(contract);
      const accounts = await ethersProvider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      setTime(new Date());
      // getTokenBalance(accounts[0]);
      console.log((new Date()).getTime());
    } else {
      alert("MetaMask is not installed!");
    }
  };

  const getTokenBalance = async (address) => {
    try {
      console.log(address)
      const balance = await uContract?.checkNoOfTokens(address);
      console.log(Number(balance));
      setTokenBalance(ethers.formatUnits(balance, 0)); // Token balance formatted
    } catch (error) {
      console.error("Error fetching token balance: ", error);
    }
  };

  const earnTokens = async () => {
    if (uContract) {
      try {
        setTime(new Date());
        const tx = await uContract.earnTokens();
        await tx.wait();
        getTokenBalance(uContract, walletAddress); // Update balance after earning tokens
        
      } catch (error) {
        console.error("Error earning tokens: ", error);
      }
    }
  };

  const reduceTokens = async () => {
    // if (contract) {
    //   try {
    //     const tx = await contract.reduceTokens(); // Call reduceTokens function
    //     await tx.wait(); // Wait for the transaction to be confirmed
    //     getTokenBalance(contract, walletAddress); // Update balance after reducing tokens
    //   } catch (error) {
    //     console.error("Error reducing tokens: ", error);
    //   }
    // }
    if (uContract && amountToReduce) {
      try {
        const tx = await uContract.reduceTokens(ethers.toBigInt(amountToReduce)); // Pass the amount entered by the user
        await tx.wait(); // Wait for the transaction to be confirmed
        getTokenBalance(uContract, walletAddress); // Update balance after reducing tokens
      } catch (error) {
        console.error("Error reducing tokens: ", error);
      }
    } else {
      alert("Please enter a valid amount to reduce!");
    }
  };

  return (
    <div className="text-black">
      <h1 className="text-black">SoulToken dApp</h1>
      {!walletAddress ? (
        <button onClick={loadProvider} className="text-black">Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {walletAddress}</p>
          <p>Token Balance: {tokenBalance} SOUL</p>
          {((time + 1)<(new Date()) ) ? (<p>Collect tokens after 24Hrs</p>):(<button onClick={earnTokens}>Earn 10 SoulTokens</button>)}
          {/* <button onClick={reduceTokens} disabled={tokenBalance == 0}>Reduce Tokens</button> */}
          {/* Input for reducing tokens */}
          <input
            type="number"
            placeholder="Enter amount to reduce"
            value={amountToReduce}
            onChange={(e) => setAmountToReduce(e.target.value)} // Set the amountToReduce state
          />
          <button onClick={() => getTokenBalance(walletAddress)}>Get Tokens</button>
          <button onClick={reduceTokens} disabled={tokenBalance == 0 || !amountToReduce}>
            Reduce Tokens
          </button>
        </div>
      )}
    </div>
  );
}

export default Sample;

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import SoulTokenABI from "./ABI/SoulToken.json"; // Import the ABI

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [time,setTime] = useState(null);

  const soulTokenAddress = "0xAc333A162DDae16d8BB8288d15D43FA795539BEf"; // Replace with your contract address

  // On mount, load the provider and connect wallet


  const loadProvider = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(soulTokenAddress, SoulTokenABI, signer);
      setContract(contract);
      const accounts = await ethersProvider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      setTime(new Date());
      getTokenBalance(contract, accounts[0]);
      console.log((new Date()).getTime());
    } else {
      alert("MetaMask is not installed!");
    }
  };

  const getTokenBalance = async (contract, address) => {
    try {
      const balance = await contract.checkNoOfTokens(address);
      setTokenBalance(ethers.formatUnits(balance, 0)); // Token balance formatted
    } catch (error) {
      console.error("Error fetching token balance: ", error);
    }
  };

  const earnTokens = async () => {
    if (contract) {
      try {
        setTime(new Date());
        const tx = await contract.earnTokens();
        await tx.wait();
        getTokenBalance(contract, walletAddress); // Update balance after earning tokens
        
      } catch (error) {
        console.error("Error earning tokens: ", error);
      }
    }
  };

  const reduceTokens = async () => {
    if (contract) {
      try {
        const tx = await contract.reduceTokens(); // Call reduceTokens function
        await tx.wait(); // Wait for the transaction to be confirmed
        getTokenBalance(contract, walletAddress); // Update balance after reducing tokens
      } catch (error) {
        console.error("Error reducing tokens: ", error);
      }
    }
  };

  return (
    <div className="App">
      <h1>SoulToken dApp</h1>
      {!walletAddress ? (
        <button onClick={loadProvider}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {walletAddress}</p>
          <p>Token Balance: {tokenBalance} SOUL</p>
          {((time + 1)<(new Date()) ) ? (<p>Collect tokens after 24Hrs</p>):(<button onClick={earnTokens}>Earn 10 SoulTokens</button>)}
          <button onClick={reduceTokens} disabled={tokenBalance == 0}>Reduce Tokens</button>
        </div>
      )}
    </div>
  );
}

export default App;

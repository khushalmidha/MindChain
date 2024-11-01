// src/context/WalletContext.js
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers'; // Only import ethers
import SoulTokenABI from '../ABI/SoulToken.json';
import ERC20_ABI from "../ABI/ERC20_ABI.json";

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const OwnerAddress="0x8Cd1d4f80e1d34410a3792c12f61DE71a59F0a56";
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState('0');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [pyusdBalance, setPyusdBalance] = useState(null);
  const [pyusdContract, setPyusdContract] = useState(null);

  const contractAddress = "0x7B5E82B74A6B97dbfa84A4aD8cD4bE2D87bf4c93"; // Replace with actual address
  // const pyusdAddress = "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9";
  const pyusdAddress = "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9";
  // Connect Wallet

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask not detected. Please install MetaMask.');
        return;
      }
      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      const userSigner = await providerInstance.getSigner();
      setSigner(userSigner);
      // console.log(userSigner);
      // console.log("1");

      const contractInstance = new ethers.Contract(contractAddress, SoulTokenABI, userSigner);
      setContract(contractInstance);
      // console.log("2");

      const pyusdContractu = new ethers.Contract(pyusdAddress, ERC20_ABI, userSigner);
      setPyusdContract(pyusdContractu);
      // console.log(contractInstance);
      console.log(pyusdContractu);
      // console.log("3");

      const accounts = await providerInstance.send('eth_requestAccounts', []);
      const userAddress = accounts[0];
      setWalletAddress(userAddress);
      setProvider(providerInstance);
      // console.log("4");

      const tokenBalance = await contractInstance.checkNoOfTokens(userAddress);
      setBalance(ethers.formatUnits(tokenBalance, 0)) // Fetch initial balance
      console.log(tokenBalance);
      // console.log("5");

      // const pyusdBalanceu = await pyusdContractu?.balanceOf(walletAddress);
      // setPyusdBalance(pyusdBalanceu);
      // console.log(pyusdBalanceu);
      // console.log("6");

    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  }, [contract]);

  // Fetch Balance
  const fetchBalance = async () => {
    try {

      // const tokenBalance = await contract.checkNoOfTokens(walletAddress);
      const tokenBalance = await contract.connect(provider).checkNoOfTokens(walletAddress);
      setBalance(ethers.formatUnits(tokenBalance, 0)); // Access utils via ethers
      console.log("Token balance: "+ tokenBalance);
      // Fetch PYUSD balance
      const pyusdBalanceu = await pyusdContract?.balanceOf(walletAddress);
      console.log("PYUSD Balance:", ethers.formatUnits(pyusdBalanceu, 6));

      setPyusdBalance(pyusdBalanceu);
      console.log(pyusdBalanceu);
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  };

  // Earn Tokens
  const earnTokens = useCallback(async () => {
    try {
      if (!contract) {
        return;
      }
      const tx = await contract.earnTokens();
      await tx.wait();
      await fetchBalance();
    } catch (error) {
      console.error('Error earning tokens:', error);
    }
  }, [contract, fetchBalance]);

  // Reduce Tokens
  const reduceTokens = useCallback(async (amount) => {
    try {
      // Ensure contract is initialized
      if (!contract) {
        console.error("Contract is not initialized.");
        return;
      }

      // Check if amount is valid
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid token amount to reduce.");
        return;
      }

      // Convert amount to token's smallest unit (e.g., wei for 18 decimals)
      const amountInWei = ethers.parseUnits(amount.toString(), 0);
      const amountInPyusd = ethers.parseUnits(amount.toString(), 6);
      console.log(amountInWei)
      console.log(balance)

      const approvalTx = await pyusdContract.increaseApproval(walletAddress, amountInPyusd);
      // await approvalTx.wait();

      const tx = await pyusdContract.transferFrom(walletAddress, OwnerAddress, amountInPyusd,{gasLimit:100000});
      // await tx.wait();

      // Call reduceTokens from the contract
      const txr = await contract.reduceTokens(amountInWei);

      // Wait for transaction confirmation
      await txr.wait();

      // Success alert and fetch the updated balance
      alert('Purchase Successful!');
      await fetchBalance(); // Refresh balance after the transaction

    } catch (error) {
      // Detailed error handling for better debugging
      if (error.code === 'INSUFFICIENT_FUNDS') {
        alert('You do not have enough tokens to reduce that amount.');
      } else {
        console.error('Error reducing tokens:', error);
        alert('An error occurred while reducing tokens. Please try again.');
      }
    }
  }, [contract, fetchBalance]);



  // Disconnect Wallet
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setBalance('0');
    setProvider(null);
    setSigner(null);
    setContract(null);
    alert('Wallet disconnected!');
  }, []);

  // Effect to detect account change
  useEffect(() => {
    if (window.ethereum) {
      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          await connectWallet();

        } else {
          disconnectWallet();
        }
      });
    }
  }, [connectWallet, disconnectWallet]);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        balance, //change here to balance
        provider,
        signer,
        contract,
        connectWallet,
        disconnectWallet,
        fetchBalance,
        earnTokens,
        reduceTokens,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;

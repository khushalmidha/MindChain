// src/context/WalletContext.js
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers'; // Only import ethers
import SoulTokenABI from '../ABI/SoulToken.json';

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState('0');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const contractAddress = "0x0848590E57E255Ad63F774559F54F5BDa21Ec648"; // Replace with actual address

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

      const contractInstance = new ethers.Contract(contractAddress, SoulTokenABI, userSigner);
      setContract(contractInstance);
      
      const accounts = await providerInstance.send('eth_requestAccounts', []);
      const userAddress = accounts[0];
      setWalletAddress(userAddress);
      setProvider(providerInstance);
      const tokenBalance = await contractInstance.checkNoOfTokens(userAddress);
      setBalance(ethers.formatUnits(tokenBalance, 0)) // Fetch initial balance
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  }, [contract]);

  // Fetch Balance
  const fetchBalance = async () => {
    try {

      const tokenBalance = await contract.checkNoOfTokens(walletAddress);
      setBalance(ethers.formatUnits(tokenBalance, 0)); // Access utils via ethers
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  };

  // Earn Tokens
  const earnTokens = useCallback(async () => {
    try {
      if (!contract){
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
      console.log(amountInWei)
      console.log(balance)
      // Call reduceTokens from the contract
      const tx = await contract.reduceTokens(amountInWei);
      
      // Wait for transaction confirmation
      await tx.wait();
  
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
        balance,
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

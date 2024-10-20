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
  useEffect(()=>{
    const providerInstance = new ethers.BrowserProvider(window.ethereum);
    const userSigner = providerInstance.getSigner();
    setSigner(userSigner);
    const contractInstance = new ethers.Contract(contractAddress, SoulTokenABI, userSigner);
    setContract(contractInstance);
  },[])
  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask not detected. Please install MetaMask.');
        return;
      }

      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      const accounts = await providerInstance.send('eth_requestAccounts', []);
      const userAddress = accounts[0];

      
      

      setWalletAddress(userAddress);
      setProvider(providerInstance);
      

      await fetchBalance(userAddress); // Fetch initial balance
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  }, []);

  // Fetch Balance
  const fetchBalance = useCallback(async (address = walletAddress) => {
    try {
      if (!contract) return;
      const tokenBalance = await contract.checkNoOfTokens(address);
      setBalance(ethers.formatUnits(tokenBalance, 0)); // Access utils via ethers
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  }, [contract, walletAddress]);

  // Earn Tokens
  const earnTokens = useCallback(async () => {
    try {
      if (!contract) return;
      const tx = await contract.earnTokens();
      await tx.wait();
      alert('Tokens earned successfully!');
      await fetchBalance();
    } catch (error) {
      console.error('Error earning tokens:', error);
    }
  }, [contract, fetchBalance]);

  // Reduce Tokens
  const reduceTokens = useCallback(async (amount) => {
    try {
      if (!contract) return;
      const amountInWei = ethers.parseUnits(amount.toString(), 18); // Access utils via ethers
      const tx = await contract.reduceTokens(amountInWei);
      await tx.wait();
      alert('Tokens reduced successfully!');
      await fetchBalance();
    } catch (error) {
      console.error('Error reducing tokens:', error);
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

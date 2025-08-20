// src/context/WalletContext.js
import React, { createContext, useState, useCallback, useEffect } from 'react'
import { ethers } from 'ethers' // Only import ethers
import SoulTokenABI from '../ABI/SoulToken.json'
import ERC20_ABI from '../ABI/ERC20_ABI.json'
import { toast } from 'react-toastify'
import axios from 'axios'
import {
  BackendUrl,
  ContractAddress as contractAddress,
  pyusdAddress,
} from '../data/const'
export const WalletContext = createContext()

const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [balance, setBalance] = useState(0)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [pyusdBalance, setPyusdBalance] = useState(0)
  const [pyusdContract, setPyusdContract] = useState(null)
  const [user, setUser] = useState({})
  // Connect Wallet
  const getUser = async () => {
    try {
      const res = await axios.post(
        `${BackendUrl}/user/create-user`,
        { address: walletAddress },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (res.status === 201) {
        console.log('User created successfully:', res.data.user)
        setUser(res.data.user)
      }
    } catch (err) {
      console.log(err.response?.data?.message || 'Internal Network Error')
    }
  }
  useEffect(() => {
    if (contract && walletAddress) {
      getUser()
    }
  }, [walletAddress,contract])
  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask not detected. Please install MetaMask.')
        return
      }
      const providerInstance = new ethers.BrowserProvider(window.ethereum)
      const userSigner = await providerInstance.getSigner()
      setSigner(userSigner)
      const contractInstance = new ethers.Contract(
        contractAddress,
        SoulTokenABI,
        userSigner
      )
      setContract(contractInstance)
      const pyusdContractu = new ethers.Contract(
        pyusdAddress,
        ERC20_ABI,
        userSigner
      )
      setPyusdContract(pyusdContractu)
      const accounts = await providerInstance.send('eth_requestAccounts', [])
      const userAddress = accounts[0]

      setProvider(providerInstance)

      const tokenBalance = await contractInstance.checkNoOfTokens(userAddress)
      setBalance(ethers.formatUnits(tokenBalance, 0)) // Fetch initial balance
      setWalletAddress(userAddress)
      toast.success('Wallet connected successfully!', {
        toastId: 'connect',
      })
      const pyusdBalanceu = await pyusdContractu?.balanceOf(userAddress)
      setPyusdBalance(ethers.formatUnits(pyusdBalanceu, 6))
    } catch (error) {
      toast.error('Error connecting wallet. Please try again.')
    }
  }, [])

  // Fetch Balance
  const fetchBalance = async () => {
    try {
      const tokenBalance = await contract
        .connect(provider)
        .checkNoOfTokens(walletAddress)
      setBalance(ethers.formatUnits(tokenBalance, 0)) // Access utils via ethers
      const pyusdBalanceu = await pyusdContract?.balanceOf(walletAddress)
      setPyusdBalance(ethers.formatUnits(pyusdBalanceu, 6))
    } catch (error) {
      toast.error('Error fetching token balance!')
    }
  }

  // Earn Tokens
  const earnTokens = useCallback(
    async (token) => {
      try {
        if (!contract) {
          throw new Error ({ message: 'Connect to wallet', code: 'WALLET_NOT_CONNECTED' })
        }
        const tx = await contract.earnTokens()
        await tx.wait()
        const res = await axios.post(`${BackendUrl}/transaction/token`, {
          transactionHash: tx?.hash,
          address: walletAddress,
          token: token || 'Activity',
        })
        if (res.status !== 201)
          throw new Error('Internal Server Error', res.data?.message)
        if (res?.data?.user) setUser(res.data.user)
        console.log(res.data)
        await fetchBalance()
        return true
      } catch (e) {
        console.log(e)
      }
    },
    [contract, fetchBalance, walletAddress]
  )

  // Reduce Tokens
  const reduceTokens = async (token, amount, workshopId, reciever) => {
    // Ensure contract is initialized
    try {
      if (!contract) {
        console.error('Contract is not initialized.')
        return
      }
      if (!workshopId) {
        throw new Error('No Workshop')
      }
      // amount = 60;
      console.log(token, " " , amount)
      var amountInWei = ethers.parseUnits(token.toString(), 0)
      var amountInPyusd = ethers.parseUnits(amount.toString(), 6)
      console.log(amountInWei ," ", amountInPyusd )
      const txr = await contract.reduceTokens(
        amountInWei,
        amountInPyusd,
        reciever
      )
      await txr.wait()
      const res = await axios.post(`${BackendUrl}/transaction/workshop`, {
        transactionHash: txr?.hash,
        workshopId,
        address: walletAddress,
        amount,
        token,
      })
      if (res.status !== 201)
        throw new Error('Internal Server Error', res.data?.message)
      if (res?.data?.user) setUser(res.data.user)
      console.log(res.data)
      console.log('Transaction successful:', txr)
      await fetchBalance()
      return txr
    } catch (e) {
      console.error('Error in transaction:', e)
      throw new Error('Transaction failed: ' + e.reason || e.message)
    }
  }

  const approveTokens = async (amount) => {
    if (!contract) {
      throw { message: 'Connect to wallet', code: 'WALLET_NOT_CONNECTED' }
    }
    // amount = 10000000;
    var amountInPyusd = ethers.parseUnits(amount.toString(), 6)
    console.log(amountInPyusd)
    const approvalTz = await pyusdContract.increaseApproval(
      contractAddress,
      amountInPyusd
    )
    await approvalTz.wait()
    return true
  }
  // Disconnect Wallet
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null)
    setBalance('0')
    setProvider(null)
    setSigner(null)
    setContract(null)
    toast.info('Wallet disconnected successfully!', {
      toastId: 'disconnect',
    })
  }, [])

  // Effect to detect account change
  useEffect(() => {
    if (window.ethereum) {
      const providerInstance = new ethers.BrowserProvider(window.ethereum)
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          await connectWallet()
        } else {
          disconnectWallet()
        }
      })
    }
  }, [connectWallet, disconnectWallet])

  return (
    <WalletContext.Provider
      value={{
        approveTokens,
        pyusdBalance,
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
        user,
        setUser,
      }}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletProvider

import React, { useContext, useState } from 'react'
import { WalletContext } from '../context/WalletContext'
import {
  FaWallet,
  FaSpinner,
  FaPowerOff,
  FaCopy,
  FaBook,
  FaExchangeAlt,
  FaPlus,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const WalletProfile = () => {
  const {
    pyusdBalance,
    walletAddress,
    balance,
    connectWallet,
    disconnectWallet,
    fetchBalance,
  } = useContext(WalletContext)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [connectLoading, setConnectLoading] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const navigate = useNavigate()

  const handleFetchBalance = async () => {
    try {
      setIsLoading(true)
      await fetchBalance()
      toast.success('Balance updated successfully!')
    } catch (error) {
      toast.error('Failed to update balance')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
      toast.info('Address copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy address')
    }
  }

  const navigateToWorkshops = () => {
    navigate('/my-workshops')
    setIsOpen(false)
  }

  const navigateToTransactions = () => {
    navigate('/my-transactions')
    setIsOpen(false)
  }

  const navigateToCreateWorkshop = () => {
    navigate('/create-workshop')
    setIsOpen(false)
  }

  const handleConnectWallet = async () => {
    try {
      setConnectLoading(true)
      await connectWallet()
    } catch (error) {
      toast.error('Failed to connect wallet')
    } finally {
      setConnectLoading(false)
    }
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.wallet-dropdown')) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className='relative flex items-center'>
      {walletAddress ? (
        <div className='relative wallet-dropdown'>
          {/* Wallet Icon with Indicator */}
          <div className='relative'>
            <FaWallet
              className='text-2xl cursor-pointer text-[#4b5161] dark:text-[#fdf5eb] hover:text-[#f58b44] transition-colors'
              onClick={() => setIsOpen(!isOpen)}
            />
            <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#fdf5eb] dark:border-[#4b5161]'></div>
          </div>

          {isOpen && (
            <div className='absolute top-12 right-0 bg-[#fdf5eb] dark:bg-[#4b5161] shadow-xl rounded-lg p-5 w-80 z-50 border border-[#4b5161] dark:border-[#fdf5eb] transition-all duration-200 ease-in-out wallet-dropdown-menu'>
              <div className='relative'>
                {/* Header */}
                <h3 className='text-lg font-bold text-center mb-4 text-[#4b5161] dark:text-[#fdf5eb] border-b border-[#4b5161] dark:border-[#fdf5eb] pb-2'>
                  Wallet Profile
                </h3>

                {/* Wallet Address with Copy Icon */}
                <div className='flex items-center justify-between mb-4 bg-[#fdf5eb] dark:bg-[#4b5161] p-2 rounded-md'>
                  <p className='font-mono text-sm font-medium text-[#4b5161] dark:text-[#fdf5eb]'>
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                  </p>
                  <button
                    className='flex items-center justify-center p-1.5 bg-[#f58b44] text-white rounded-md hover:bg-[#d67a3a] transition-colors'
                    onClick={copyToClipboard}
                    aria-label='Copy wallet address'>
                    <FaCopy
                      className={`text-sm ${copySuccess ? 'text-green-500' : 'text-white'
                        }`}
                    />
                  </button>
                </div>

                {/* Balances Section */}
                <div className='mb-4 bg-[#fdf5eb] dark:bg-[#4b5161] p-3 rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center'>
                      <div className='w-2 h-2 bg-[#f58b44] rounded-full mr-2'></div>
                      <p className='text-md font-medium text-[#4b5161] dark:text-[#fdf5eb]'>
                        SOUL Tokens
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <p className='font-bold text-[#f58b44]'>{balance}</p>
                      <button
                        onClick={handleFetchBalance}
                        disabled={isLoading}
                        className='p-1 bg-[#f58b44] text-white rounded-full hover:bg-[#d67a3a] transition-colors'>
                        <FaSpinner
                          className={`text-xs ${isLoading ? 'animate-spin' : ''
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
                      <p className='text-md font-medium text-[#4b5161] dark:text-[#fdf5eb]'>
                        PYUSD Tokens
                      </p>
                    </div>
                    <p className='font-bold text-green-600 dark:text-green-400'>
                      {pyusdBalance}
                    </p>
                  </div>
                </div>

                {/* Create Workshop Button */}
                <button
                  onClick={navigateToCreateWorkshop}
                  className='w-full py-2.5 mb-4 bg-[#f58b44] text-white rounded-md hover:bg-[#d67a3a] flex items-center justify-center gap-2 transition-all duration-200 shadow-sm font-medium'>
                  <FaPlus size={14} /> Create Workshop
                </button>

                {/* Navigation Buttons */}
                <div className='grid grid-cols-2 gap-3 mb-4'>
                  <button
                    onClick={navigateToWorkshops}
                    className='flex items-center justify-center gap-2 py-2 bg-[#4b5161] text-white rounded-md hover:bg-[#3a3f4d] transition-colors shadow-sm'>
                    <FaBook /> Workshops
                  </button>

                  <button
                    onClick={navigateToTransactions}
                    className='flex items-center justify-center gap-2 py-2 bg-[#4b5161] text-white rounded-md hover:bg-[#3a3f4d] transition-colors shadow-sm'>
                    <FaExchangeAlt /> Transactions
                  </button>
                </div>

                {/* Disconnect Button */}
                <button
                  onClick={disconnectWallet}
                  className='w-full py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center gap-2 transition-all duration-200 shadow-sm font-medium'>
                  <FaPowerOff /> Disconnect Wallet
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleConnectWallet}
          disabled={connectLoading}
          className='bg-[#f58b44] text-white py-2.5 px-5 rounded-md hover:bg-[#d67a3a] transition-all duration-200 flex items-center gap-2 font-medium shadow-sm'>
          {connectLoading ? (
            <>
              <FaSpinner className='animate-spin' /> Connecting...
            </>
          ) : (
            <>
              <FaWallet /> Connect Wallet
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default WalletProfile

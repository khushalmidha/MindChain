import React, { useState, useEffect, useContext } from 'react'
import { WalletContext } from '../context/WalletContext'
import {
  FaExchangeAlt,
  FaBook,
  FaCoins,
  FaSearch,
  FaChevronRight,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa'
import { format } from 'date-fns'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BackendUrl } from '../data/const'

const Transactions = () => {
  const { walletAddress } = useContext(WalletContext)
  const [activeTab, setActiveTab] = useState('all')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTransactions, setFilteredTransactions] = useState([])

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletAddress) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Fetch transactions from API
        const response = await axios.get(`${BackendUrl}/user/transactions?address=${walletAddress}`)
        const reversedTransactions = response.data.reverse()
        setTransactions(reversedTransactions)
        setFilteredTransactions(reversedTransactions)
      } catch (error) {
        console.error('Error fetching transactions:', error)
        toast.error('Failed to load transaction history')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [walletAddress])

  // Filter transactions when tab changes or search term is updated
  useEffect(() => {
    if (!transactions.length) {
      setFilteredTransactions([])
      return
    }

    let filtered = [...transactions]

    // Apply tab filter
    if (activeTab === 'workshop') {
      filtered = filtered.filter((tx) => tx.type === 'workshop')
    } else if (activeTab === 'token') {
      filtered = filtered.filter((tx) => tx.type === 'token')
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.transactionHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tx.token &&
            tx.token.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredTransactions(filtered)
  }, [transactions, activeTab, searchTerm])

  // Function to truncate hash
  const truncateHash = (hash) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`
  }

  // Function to handle copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.info('Transaction hash copied to clipboard')
  }

  // Mock data for transaction display
  const mockTransactions = [
    {
      _id: '1',
      transactionHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      type: 'workshop',
      workshop: '613vdj2i72y8ui1hugeuo279',
      token: 'How to Control Anger?',
      transactionType: 'debit',
      amount: 4.5,
      createdAt: new Date('2025-03-15T10:30:00'),
    },
    {
      _id: '2',
      transactionHash: '0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
      type: 'token',
      token: 'Breathing Exercise',
      transactionType: 'credit',
      amount: 10,
      createdAt: new Date('2025-03-10T14:45:00'),
    },
    {
      _id: '3',
      transactionHash: '0x9i8u7y6t5r4e3w2q1p0o9i8u7y6t5r4e3w2q1p0',
      type: 'workshop',
      workshop: '213gsd72i72y8ui1hugeuo180',
      token: 'DeFi Fundamentals',
      transactionType: 'credit',
      amount: 60,
      createdAt: new Date('2025-03-05T09:15:00'),
    },
    {
      _id: '4',
      transactionHash: '0xq1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9',
      type: 'token',
      token: 'Tokens Redeemed',
      transactionType: 'debit',
      amount: 15,
      createdAt: new Date('2025-03-01T16:20:00'),
    },
    {
      _id: '5',
      transactionHash: '0xz1x2c3v4b5n6m7q8w9e0r1t2y3u4i5o6p7a8s9d',
      type: 'workshop',
      workshop: 'w3f5s9d7a1v3b5n9m4k2l8p6o1i2u4',
      token: 'Smart Contract Development',
      transactionType: 'debit',
      amount: 120,
      createdAt: new Date('2025-02-25T11:10:00'),
    },
  ]

  return (
    <div className='min-h-screen bg-[#fdf5eb] dark:bg-[#4b5161] py-4  px-4 sm:px-6 lg:px-8'>
      <div className='max-w-5xl mx-auto'>
        {/* Header with solid background */}
        <div className='relative mb-10'>
          <div className='absolute inset-0 bg-[#f58b44]'></div>
          <div className='relative px-4 py-12 sm:px-6 lg:px-8 text-center'>
            <h1 className='text-4xl sm:text-5xl font-bold text-white mb-4'>
              Transaction History
            </h1>
            <p className='text-lg text-[#fdf5eb]'>
              Track all your transactions on the MindChain.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className='mb-8 bg-[#fdf5eb] dark:bg-[#4b5161] shadow-lg rounded-lg p-4 border border-[#4b5161]/10 dark:border-[#fdf5eb]/10'>
          <div className='flex flex-col sm:flex-row items-center gap-4'>
            <div className='relative flex-grow'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaSearch className='text-[#4b5161] dark:text-[#fdf5eb]' />
              </div>
              <input
                type='text'
                className='block w-full pl-10 pr-3 py-2 rounded-md focus:ring-2 focus:ring-[#f58b44] bg-white dark:bg-[#4b5161]/80 text-[#4b5161] dark:text-[#fdf5eb] border border-[#4b5161]/10 dark:border-[#fdf5eb]/10'
                placeholder='Search transactions...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='mb-6 border-b border-[#4b5161]/20 dark:border-[#fdf5eb]/20'>
          <nav className='flex'>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-6 font-medium text-lg flex items-center gap-2 border-b-2 ${
                activeTab === 'all'
                  ? 'border-[#f58b44] text-[#f58b44] dark:text-[#f58b44]'
                  : 'border-transparent text-[#4b5161]/80 dark:text-[#fdf5eb]/80 hover:text-[#f58b44] hover:border-[#f58b44]/50'
              } transition-colors duration-200`}>
              <FaExchangeAlt />
              All Transactions
            </button>
            <button
              onClick={() => setActiveTab('workshop')}
              className={`py-4 px-6 font-medium text-lg flex items-center gap-2 border-b-2 ${
                activeTab === 'workshop'
                  ? 'border-[#f58b44] text-[#f58b44] dark:text-[#f58b44]'
                  : 'border-transparent text-[#4b5161]/80 dark:text-[#fdf5eb]/80 hover:text-[#f58b44] hover:border-[#f58b44]/50'
              } transition-colors duration-200`}>
              <FaBook />
              Workshops
            </button>
            <button
              onClick={() => setActiveTab('token')}
              className={`py-4 px-6 font-medium text-lg flex items-center gap-2 border-b-2 ${
                activeTab === 'token'
                  ? 'border-[#f58b44] text-[#f58b44] dark:text-[#f58b44]'
                  : 'border-transparent text-[#4b5161]/80 dark:text-[#fdf5eb]/80 hover:text-[#f58b44] hover:border-[#f58b44]/50'
              } transition-colors duration-200`}>
              <FaCoins />
              Tokens
            </button>
          </nav>
        </div>

        {/* Transaction List */}
        <div>
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#f58b44]'></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className='text-center py-16 bg-[#fdf5eb] dark:bg-[#4b5161] rounded-lg shadow-lg'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4b5161] dark:bg-[#fdf5eb] mb-4'>
                <FaExchangeAlt className='h-8 w-8 text-[#fdf5eb] dark:text-[#4b5161]' />
              </div>
              <h3 className='text-lg font-medium text-[#4b5161] dark:text-[#fdf5eb]'>
                No transactions found
              </h3>
              <p className='mt-2 text-[#4b5161]/80 dark:text-[#fdf5eb]/70'>
                {searchTerm
                  ? 'Try different search terms'
                  : activeTab !== 'all'
                  ? `No ${activeTab} transactions found.`
                  : 'Your transaction history will appear here.'}
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4'>
              {filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction._id}
                  transaction={transaction}
                  truncateHash={truncateHash}
                  copyToClipboard={copyToClipboard}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Transaction Card Component
const TransactionCard = ({ transaction, truncateHash, copyToClipboard }) => {
  const { transactionHash, type, token, transactionType, amount, createdAt } =
    transaction

  // Determine if this is a purchase, earning, sale or redemption
  const isWorkshopDebit = type === 'workshop' && transactionType === 'debit'
  const isWorkshopCredit = type === 'workshop' && transactionType === 'credit'
  const isTokenCredit = type === 'token' && transactionType === 'credit'
  const isTokenDebit = type === 'token' && transactionType === 'debit'

  return (
    <div className='bg-white dark:bg-[#4b5161]/80 rounded-lg shadow-md overflow-hidden border border-[#4b5161]/10 dark:border-[#fdf5eb]/10 hover:shadow-lg transition-all duration-200'>
      <div className='p-5'>
        {/* Header with Transaction Type and Date */}
        <div className='flex flex-wrap items-center justify-between mb-3'>
          <div className='flex items-center gap-2 mb-2 sm:mb-0'>
            {/* Transaction Type Badge */}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                type === 'workshop'
                  ? 'bg-[#f58b44]/10 text-[#f58b44]'
                  : 'bg-[#4b5161]/10 text-[#4b5161] dark:bg-[#fdf5eb]/10 dark:text-[#fdf5eb]'
              }`}>
              {type === 'workshop' ? (
                <>
                  <FaBook className='mr-1' />
                  Workshop
                </>
              ) : (
                <>
                  <FaCoins className='mr-1' />
                  Token
                </>
              )}
            </span>

            {/* Transaction Type (Credit/Debit) Badge */}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                transactionType === 'credit'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
              {transactionType === 'credit' ? (
                <>
                  <FaArrowUp className='mr-1' />
                  Credit
                </>
              ) : (
                <>
                  <FaArrowDown className='mr-1' />
                  Debit
                </>
              )}
            </span>
          </div>

          <span className='text-sm text-[#4b5161]/60 dark:text-[#fdf5eb]/60'>
            {createdAt && format(new Date(createdAt), 'MMM d, yyyy • h:mm a')}
          </span>
        </div>

        {/* Transaction Content */}
        <div className='mt-4'>
          {/* Description */}
          <div className='mb-3'>
            <h3 className='text-lg font-medium text-[#4b5161] dark:text-[#fdf5eb]'>
              {isWorkshopDebit && `Purchased Workshop: ${token}`}
              {isWorkshopCredit && `Workshop Sale: ${token}`}
              {isTokenCredit && `Earned Tokens: ${token}`}
              {isTokenDebit && 'Tokens Redeemed for Discount'}
            </h3>
          </div>

          {/* Amount */}
          <div className='mb-3'>
            <span className='text-[#4b5161]/80 dark:text-[#fdf5eb]/80 text-sm mr-2'>
              Amount:
            </span>
            <span
              className={`font-medium ${
                transactionType === 'credit'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
              {transactionType === 'credit' ? '+' : '-'}
              {amount}
              {type === 'workshop' ? ' PYUSD' : ' SOUL'}
            </span>
          </div>

          {/* Transaction Hash */}
          <div className='flex items-center mt-2 border-t border-[#4b5161]/10 dark:border-[#fdf5eb]/10 pt-3'>
            <span className='text-[#4b5161]/60 dark:text-[#fdf5eb]/60 text-sm mr-2'>
              Hash:
            </span>
            <span
              className='font-mono text-sm text-[#4b5161] dark:text-[#fdf5eb] cursor-pointer hover:text-[#f58b44] dark:hover:text-[#f58b44] transition-colors'
              onClick={() => copyToClipboard(transactionHash)}
              title='Click to copy'>
              {truncateHash(transactionHash)}
            </span>
            <button
              className='ml-2 text-[#4b5161]/60 dark:text-[#fdf5eb]/60 hover:text-[#f58b44] dark:hover:text-[#f58b44] transition-colors'
              onClick={() => copyToClipboard(transactionHash)}
              title='Copy transaction hash'>
              <svg
                className='h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
            </button>
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target='_blank'
              rel='noopener noreferrer'
              className='ml-auto text-[#f58b44] hover:text-[#d67a3a] transition-colors flex items-center gap-1'
              title='View on blockchain explorer'>
              <span className='text-sm'>View</span>
              <FaChevronRight className='h-3 w-3' />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transactions

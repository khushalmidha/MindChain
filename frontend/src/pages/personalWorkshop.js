import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import WorkshopCard from '../components/workshopCard'
import { BackendUrl } from '../data/const'
import { useContext } from 'react'
import { WalletContext } from '../context/WalletContext'
import { FaShoppingBag, FaPencilAlt, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const PersonalWorkshop = () => {
  const { walletAddress,user } = useContext(WalletContext)
  const [purchasedWorkshops, setPurchasedWorkshops] = useState([])
  const [createdWorkshops, setCreatedWorkshops] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('purchased') // 'purchased' or 'created'

  // Fetch purchased workshops
  const fetchPurchasedWorkshops = async () => {
    try {
      const response = await axios.get(
        `${BackendUrl}/user/purchased-workshops`,
        {
          params: { address: walletAddress },
        }
      )
      setPurchasedWorkshops(response.data)
    } catch (error) {
      toast.error('Failed to fetch purchased workshops')
    }
  }

  // Fetch created workshops
  const fetchCreatedWorkshops = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/user/created-workshops`, {
        params: { address: walletAddress },
      })
      setCreatedWorkshops(response.data)
    } catch (error) {
      toast.error('Failed to fetch created workshops')
    }
  }

  useEffect(() => {
    setLoading(true)
    if (walletAddress && user && user.walletAddress===walletAddress) {
      Promise.all([fetchPurchasedWorkshops(), fetchCreatedWorkshops()]).finally(
        () => setLoading(false)
      )
    }
    setLoading(false)
  }, [walletAddress,user])

  return (
    <div className='min-h-screen bg-[#fdf5eb] dark:bg-[#4b5161] text-[#4b5161] dark:text-[#fdf5eb] pb-8'>
      {/* Header with solid background */}
      <div className='relative mb-8'>
        <div className='absolute inset-0 bg-[#f58b44]'></div>
        <div className='relative px-4 py-12 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl sm:text-5xl font-bold text-white mb-4'>
            My Workshops
          </h1>
          <p className='text-lg text-[#fdf5eb] max-w-2xl mx-auto'>
            Manage workshops you've purchased and created
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='border-b border-[#4b5161]/20 dark:border-[#fdf5eb]/20'>
          <nav className='flex -mb-px'>
            <button
              onClick={() => setActiveTab('purchased')}
              className={`py-4 px-6 font-medium text-lg flex items-center gap-2 border-b-2 ${
                activeTab === 'purchased'
                  ? 'border-[#f58b44] text-[#f58b44] dark:text-[#f58b44]'
                  : 'border-transparent text-[#4b5161]/80 dark:text-[#fdf5eb]/80 hover:text-[#f58b44] hover:border-[#f58b44]/50'
              } transition-colors duration-200`}>
              <FaShoppingBag />
              Purchased
              {purchasedWorkshops.length > 0 && (
                <span className='ml-2 bg-[#f58b44] text-white text-xs font-semibold px-2 py-0.5 rounded-full'>
                  {purchasedWorkshops.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('created')}
              className={`py-4 px-6 font-medium text-lg flex items-center gap-2 border-b-2 ${
                activeTab === 'created'
                  ? 'border-[#f58b44] text-[#f58b44] dark:text-[#f58b44]'
                  : 'border-transparent text-[#4b5161]/80 dark:text-[#fdf5eb]/80 hover:text-[#f58b44] hover:border-[#f58b44]/50'
              } transition-colors duration-200`}>
              <FaPencilAlt />
              Created
              {createdWorkshops.length > 0 && (
                <span className='ml-2 bg-[#f58b44] text-white text-xs font-semibold px-2 py-0.5 rounded-full'>
                  {createdWorkshops.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className='mt-8'>
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#f58b44]'></div>
            </div>
          ) : (
            <>
              {/* Purchased Workshops Tab Content */}
              {activeTab === 'purchased' && (
                <div>
                  {purchasedWorkshops.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                      {purchasedWorkshops.map((workshop) => (
                        <WorkshopCard
                          key={workshop._id}
                          workshop={{ ...workshop, purchased: true }}
                          isCreator={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-16 bg-[#fdf5eb] dark:bg-[#4b5161] rounded-lg shadow-lg'>
                      <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4b5161] dark:bg-[#fdf5eb] mb-4'>
                        <FaShoppingBag className='h-8 w-8 text-[#fdf5eb] dark:text-[#4b5161]' />
                      </div>
                      <h3 className='text-lg font-medium text-[#4b5161] dark:text-[#fdf5eb]'>
                        You haven't purchased any workshops yet
                      </h3>
                      <p className='mt-2 text-[#4b5161]/80 dark:text-[#fdf5eb]/80 max-w-md mx-auto'>
                        Explore available workshops and enhance your mindfulness
                        journey
                      </p>
                      <Link
                        to='/workshop'
                        className='mt-6 inline-flex items-center px-6 py-3 bg-[#f58b44] text-white font-medium rounded-lg hover:bg-[#d67a3a] transition-all duration-200 shadow-md'>
                        Explore Workshops
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Created Workshops Tab Content */}
              {activeTab === 'created' && (
                <div>

                  {createdWorkshops.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                      {createdWorkshops.map((workshop) => (
                        <WorkshopCard
                          key={workshop._id}
                          workshop={workshop}
                          isCreator={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-16 bg-[#fdf5eb] dark:bg-[#4b5161] rounded-lg shadow-lg'>
                      <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4b5161] dark:bg-[#fdf5eb] mb-4'>
                        <FaPencilAlt className='h-8 w-8 text-[#fdf5eb] dark:text-[#4b5161]' />
                      </div>
                      <h3 className='text-lg font-medium text-[#4b5161] dark:text-[#fdf5eb]'>
                        You haven't created any workshops yet
                      </h3>
                      <p className='mt-2 text-[#4b5161]/80 dark:text-[#fdf5eb]/80 max-w-md mx-auto'>
                        Share your expertise by creating and publishing
                        workshops
                      </p>
                      <Link
                        to='/create-workshop'
                        className='mt-6 inline-flex items-center px-6 py-3 bg-[#f58b44] text-white font-medium rounded-lg hover:bg-[#d67a3a] transition-all duration-200 shadow-md'>
                        <FaPlus
                          size={14}
                          className='mr-2'
                        />{' '}
                        Create Workshop
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalWorkshop

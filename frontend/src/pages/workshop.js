import React, { useEffect, useState, useContext } from 'react'
import WorkshopCard from '../components/workshopCard'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BackendUrl } from '../data/const'
import { WalletContext } from '../context/WalletContext'
import { FaSearch, FaFilter } from 'react-icons/fa'

const Workshop = () => {
  const { user } =
    useContext(WalletContext)
  const { walletAddress } = useContext(WalletContext)
  const [workshops, setWorkshops] = useState([])
  const [purchasedWorkshopIds, setPurchasedWorkshopIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)

  // Fetch workshops from backend
  const fetchWorkshops = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${BackendUrl}/workshop/all-workshops`) // Backend endpoint
      const workshopsWithDiscount = response.data.map((workshop) => ({
        ...workshop,
        discount: workshop.price > 50 ? 10 : 5, // Apply 10% discount for price > 50, else 5%
      }))
      setWorkshops(workshopsWithDiscount)
    } catch (error) {
      toast.error('Failed to fetch workshops',{
        toastId:'workshop-failure'
      })
    } finally {
      setIsLoading(false)
    }
  }


  // Handle workshop purchase
  

  // Filter workshops based on search term and available status
  const availableWorkshops = workshops.filter(
    (workshop) =>
      workshop.owner !== walletAddress && // Not created by user
      !purchasedWorkshopIds?.includes(workshop._id) && // Not purchased
      (workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  useEffect(()=>{
    setIsLoading(true)
    if(user?.purchasedWorkshops){
        setPurchasedWorkshopIds(user.purchasedWorkshops)
    }
    setIsLoading(false)
  },[user])
  useEffect(() => {
    fetchWorkshops()
  }, [walletAddress])

  return (
    <div className='min-h-screen bg-[#fdf5eb] dark:bg-[#4b5161] pb-12'>
      {/* Header Section with Solid Background */}
      <div className='relative mb-10'>
        <div className='absolute inset-0 bg-[#f58b44]'></div>
        <div className='relative px-4 py-12 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl sm:text-5xl font-bold text-white mb-4'>
            Workshops
          </h1>
        </div>

        {/* Search Bar */}
        <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search available workshops...'
              className='pl-10 pr-4 py-3 w-72 rounded-full border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-[#f58b44] bg-[#fdf5eb] dark:bg-[#fdf5eb] text-[#4b5161]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4b5161]' />
          </div>
        </div>
      </div>

      {/* Workshop Cards Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16'>
        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#f58b44]'></div>
          </div>
        ) : (
          <>
            {availableWorkshops.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                {availableWorkshops.map((workshop) => (
                  <WorkshopCard
                    key={workshop._id}
                    workshop={workshop}
                    isCreator={false} // Will always be false in this filtered view
                    isDisabled={isPurchasing} // Disable button if purchasing
                    setIsPurchasing={setIsPurchasing}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-16 bg-[#fdf5eb] dark:bg-[#4b5161] rounded-lg shadow-lg w-full'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4b5161] dark:bg-[#fdf5eb] mb-4'>
                  <FaFilter className='h-8 w-8 text-[#fdf5eb] dark:text-[#4b5161]' />
                </div>
                <h3 className='text-lg font-medium text-[#4b5161] dark:text-[#fdf5eb]'>
                  No available workshops found
                </h3>
                <p className='mt-2 text-[#4b5161] dark:text-[#fdf5eb] opacity-75'>
                  {searchTerm
                    ? 'Try different search terms'
                    : 'You have purchased or created all available workshops.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Workshop

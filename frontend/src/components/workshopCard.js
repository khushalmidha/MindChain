import React, { useEffect, useState } from 'react'
import { WalletContext } from '../context/WalletContext'
import { toast } from 'react-toastify'
import {
  FaYinYang,
  FaShoppingCart,
  FaCheck,
  FaMoneyBillWave,
  FaUserCircle,
} from 'react-icons/fa'

const WorkshopCard = ({
  workshop,
  isCreator,
  isDisabled = false,
  setIsPurchasing,
}) => {
  const { title, price, description, purchased, imageUrl } = workshop
  const { balance, walletAddress, fetchBalance, approveTokens, reduceTokens } =
    React.useContext(WalletContext)
  const [pyusdToken, setPyusdToken] = useState(price)
  const [soulToken, setSoulToken] = useState(0)
  console.log(isDisabled)
  // Default image if none provided
  const defaultImage = require('../images/404-image.png')

  // Placeholder images for different workshop types
  const placeholderImages = [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fG1lZGl0YXRpb258ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  ]

  // Get a random image from placeholders or use the actual image if available
  const imageSource =
    imageUrl ||
    placeholderImages[Math.floor(Math.random() * placeholderImages.length)]

  useEffect(() => {
    const token = Number(price)
    const handleFetchDiscount = () => {
      // Calculate the discount based on user's balance (max 200 tokens)
      const maxDiscountTokens = Math.min(balance, 200)

      // Each token provides 0.01 PYUSD discount
      const discountAmount = Math.min(maxDiscountTokens / 100,token - 1)

      // Calculate the final price (minimum 1 PYUSD)
      const discountedPrice = token - discountAmount

      // Round to 2 decimal places for better display
      const roundedPrice = Math.round(discountedPrice * 100) / 100

      // The soul tokens used is simply the discount amount * 100
      const tokensUsed = Math.floor(discountAmount * 100)
      // console.log(roundedPrice, " " , tokensUsed)
      setPyusdToken(roundedPrice)
      setSoulToken(tokensUsed)
    }
    if (walletAddress && balance > 0) {
      handleFetchDiscount()
    }
  }, [walletAddress, balance, price])

  const handleBuyWorkshop = async () => {
    setIsPurchasing(true)
    try {
      if (!walletAddress) {
        toast.warning('Please connect your wallet')
        return
      }

      await fetchBalance()
      // Define the required tokens for the purchase

      // Approve tokens
      console.log(pyusdToken)
      const res = await toast.promise(approveTokens(pyusdToken), {
        pending: 'Approving Tokens',
        success: 'Tokens Approved!',
        error: 'Approval Aborted',
      })

      if (res) {
        // Reduce tokens and complete the purchase
        const res1 = await toast.promise(
          reduceTokens(soulToken, pyusdToken, workshop?._id, workshop?.owner),
          {
            pending: 'Purchasing Workshop',
            success: 'Workshop Purchased!',
            error: (err) => err?.message || 'Invalid Transaction',
          }
        )
        setIsPurchasing(false)
      }
    } catch (err) {
      toast.error('Transaction Failed')
    } finally {
      setIsPurchasing(false)
    }
  }

  // Calculate if a discount is available
  const hasDiscount =
    !isCreator &&
    !purchased &&
    walletAddress &&
    price !== 0 &&
    balance > 0 &&
    price !== pyusdToken

  return (
    <div className='group relative bg-[#fdf5eb] dark:bg-[#4b5161] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col border border-[#4b5161]/10 dark:border-[#fdf5eb]/10'>
      {/* Image with solid orange background */}
      <div className='relative w-full pt-[60%] overflow-hidden'>
        <div className='absolute inset-0 bg-[#f58b44]'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-32 h-32 rounded-full bg-[#fdf5eb] dark:bg-[#fdf5eb] p-2 shadow-lg overflow-hidden'>
              <img
                src={imageSource}
                alt={title}
                className='w-full h-full object-cover rounded-full'
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = defaultImage
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Workshop status badges */}
      <div className='absolute top-4 right-4'>
        {purchased && (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
            <FaCheck className='mr-1' /> Purchased
          </span>
        )}
        {isCreator && (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f58b44]/20 text-[#f58b44] dark:bg-[#f58b44]/30 dark:text-[#fdf5eb] ml-2'>
            <FaUserCircle className='mr-1' /> Creator
          </span>
        )}
      </div>

      {/* Content */}
      <div className='px-6 py-6 flex-1 flex flex-col'>
        <h3 className='text-xl font-bold text-[#4b5161] dark:text-[#fdf5eb] mb-2'>
          {title}
        </h3>
        <p className='text-[#4b5161]/80 dark:text-[#fdf5eb]/70 text-sm flex-1 line-clamp-3 mb-4'>
          {description}
        </p>

        <div className='mt-auto'>
          {/* Price section with discount */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center'>
              <FaMoneyBillWave className='text-[#f58b44] mr-2' />
              <div>
                {hasDiscount ? (
                  <>
                    <div className='flex items-center gap-2'>
                      <p className='font-bold text-lg text-[#4b5161] dark:text-[#fdf5eb] line-through opacity-50'>
                        {price} PYUSD
                      </p>
                      <p className='font-bold text-lg text-[#f58b44]'>
                        {pyusdToken} PYUSD
                      </p>
                    </div>
                    <p className='text-sm text-green-600 dark:text-green-400'>
                      Save {(price - pyusdToken).toFixed(2)} PYUSD with your
                      Soul Tokens
                    </p>
                  </>
                ) : (
                  <p className='font-bold text-lg text-[#4b5161] dark:text-[#fdf5eb]'>
                    {price} PYUSD
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action button */}
          {!isCreator && !purchased ? (
            <button
              onClick={handleBuyWorkshop}
              disabled={isDisabled}
              className='w-full flex items-center justify-center px-4 py-3 bg-[#f58b44] text-white font-medium rounded-lg hover:bg-[#d67a3a] transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-[#f58b44] focus:ring-offset-2'>
              <FaShoppingCart className='mr-2' /> Buy Workshop
            </button>
          ) : purchased ? (
            <button className='w-full flex items-center justify-center px-4 py-3 bg-[#4b5161] text-[#fdf5eb] font-medium rounded-lg cursor-default'>
              <FaYinYang className='mr-2' /> Start Workshop
            </button>
          ) : (
            <button
              className='w-full flex items-center justify-center px-4 py-3 bg-[#fdf5eb] dark:bg-[#4b5161]/30 text-[#4b5161] dark:text-[#fdf5eb]/70 font-medium rounded-lg border border-[#4b5161]/20 dark:border-[#fdf5eb]/20'
              disabled>
              <FaUserCircle className='mr-2' /> Your Workshop
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkshopCard

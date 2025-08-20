import React from 'react'
import { Link } from 'react-router-dom'
import { FaBook, FaDumbbell, FaYinYang, FaChartLine } from 'react-icons/fa'
import homepageIllustration from '../images/homepage-hero-guest/undraw_mindfulness_scgo.svg'

const Home = () => {

  return (
    <div className='min-h-screen bg-[#fdf5eb] dark:bg-gray-800 dark:bg-[#4b5161]text-[#4b5161] dark:text-[#fdf5eb]'>
      {/* Hero Section */}
      <section className='h-[65vh] flex items-center px-4 sm:px-6 md:px-8 lg:px-16 max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row items-center'>
          {/* Left Column - Text Content */}
          <div className='w-full md:w-1/2 md:pr-8'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-4'>
              <span className='text-[#f58b44]'>Mind</span> Chain
            </h1>
            <h2 className='text-2xl md:text-3xl font-semibold text-[#4b5161] dark:text-[#fdf5eb] mb-4'>
            Be kind to your mind, it will be fine
            </h2>
            <p className='text-lg mb-6'>
            Less stressed. More resilient. Happier. It all starts with just a few minutes a day.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link
                to='/workshop'
                className='flex items-center justify-center gap-2 px-6 py-3 bg-[#f58b44] text-white rounded-lg hover:bg-[#d67a3a] transition-all duration-200 font-medium shadow-md'>
                <FaYinYang size={18} />
                <span>Explore Meditation</span>
              </Link>
              <Link
                to='/activities'
                className='flex items-center justify-center gap-2 px-6 py-3 bg-[#4b5161] text-white rounded-lg hover:bg-[#3a3f4d] transition-all duration-200 font-medium shadow-md'>
                <FaDumbbell size={18} />
                <span>Try Activities</span>
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className='w-full md:w-1/2 mt-6 md:mt-0 flex justify-center'>
            <img
              src={homepageIllustration}
              alt='Mindfulness Illustration'
              className='w-full max-w-md'
              style={{ animation: 'float 6s ease-in-out infinite' }}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='mb-8 px-4 sm:px-6 md:px-8 lg:px-16 max-w-7xl mx-auto'>
        <div className='bg-[#f58b44] text-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between'>
          <div className='mb-4 md:mb-0 md:mr-6'>
            <h2 className='text-xl md:text-2xl font-bold mb-2'>
              Ready to start your mindfulness journey?
            </h2>
            <p className='text-[#fdf5eb]'>
              Connect your wallet to start earning rewards today.
            </p>
          </div>
          <Link
            to='/workshop'
            className='whitespace-nowrap px-6 py-3 bg-white text-[#f58b44] rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium shadow-md'>
            Get Started
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className='pt-0 pb-8 px-4 sm:px-6 md:px-8 lg:px-16 max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {/* Benefit 1 */}
          <div className='bg-[#f58b44] dark:bg-[#f58b44] text-white p-4 rounded-xl shadow hover:shadow-md transition-all duration-200'>
            <div className='flex items-center mb-2'>
              <div className='bg-white dark:bg-[#fdf5eb] w-10 h-10 flex items-center justify-center rounded-full mr-3'>
                <FaYinYang className='text-[#f58b44]' size={20} />
              </div>
              <h3 className='text-lg font-semibold'>Meditate</h3>
            </div>
            <p className='text-sm'>
              Practice guided meditation sessions for mindfulness.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className='bg-[#4b5161] dark:bg-[#4b5161] text-white p-4 rounded-xl shadow hover:shadow-md transition-all duration-200'>
            <div className='flex items-center mb-2'>
              <div className='bg-white dark:bg-[#fdf5eb] w-10 h-10 flex items-center justify-center rounded-full mr-3'>
                <FaDumbbell className='text-[#4b5161]' size={20} />
              </div>
              <h3 className='text-lg font-semibold'>Activities</h3>
            </div>
            <p className='text-sm'>
              Interactive experiences designed to calm your mind.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className='bg-[#f58b44] dark:bg-[#f58b44] text-white p-4 rounded-xl shadow hover:shadow-md transition-all duration-200'>
            <div className='flex items-center mb-2'>
              <div className='bg-white dark:bg-[#fdf5eb] w-10 h-10 flex items-center justify-center rounded-full mr-3'>
                <FaBook className='text-[#f58b44]' size={20} />
              </div>
              <h3 className='text-lg font-semibold'>Workshops</h3>
            </div>
            <p className='text-sm'>
              Join expert-led wellness sessions and events.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className='bg-[#4b5161] dark:bg-[#4b5161] text-white p-4 rounded-xl shadow hover:shadow-md transition-all duration-200'>
            <div className='flex items-center mb-2'>
              <div className='bg-white dark:bg-[#fdf5eb] w-10 h-10 flex items-center justify-center rounded-full mr-3'>
                <FaChartLine className='text-[#4b5161]' size={20} />
              </div>
              <h3 className='text-lg font-semibold'>Rewards</h3>
            </div>
            <p className='text-sm'>
              Earn SOUL tokens by completing wellness activities.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

// Add animation keyframes
const styleSheet = document.createElement('style')
styleSheet.textContent = `
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}
`
document.head.appendChild(styleSheet)

export default Home

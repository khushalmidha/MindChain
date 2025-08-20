import React, { useState, useContext, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import headspaceLogo from '../images/headspace_dot.png'
import useDarkMode from '../hooks/useDarkMode.js'
import WalletProfile from './WalletProfile'
import { useTranslation } from 'react-i18next'
import { WalletContext } from '../context/WalletContext'
import { FaBook, FaDumbbell, FaUsers } from 'react-icons/fa'
import { MdOutlineLightMode, MdOutlineDarkMode, MdMenu, MdClose } from 'react-icons/md'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [colorTheme, setColorTheme] = useDarkMode()
  const { t } = useTranslation()
  const { walletAddress } = useContext(WalletContext)
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-[#fdf5eb] dark:bg-[#4b5161] shadow-md'
            : 'bg-[#fdf5eb] dark:bg-[#4b5161]'
          }`}>
        <div className='w-full flex items-center justify-between h-16'>
          <div className='flex items-center pl-4 sm:pl-6 lg:pl-8'>
            <Link to='/' className='flex items-center gap-3'>
              <img src={headspaceLogo} alt='MindChain Logo' className='h-10 w-10' />
              <span className='font-bold text-2xl text-[#4b5161] dark:text-[#fdf5eb]'>
                Mind<span className='text-[#f58b44]'>Chain</span>
              </span>
            </Link>
          </div>

          <div className='hidden lg:flex items-center justify-center'>
            <Link
              to='/workshop'
              className='flex items-center px-4 py-2 rounded-md text-lg font-medium text-[#4b5161] dark:text-[#fdf5eb] hover:text-[#f58b44] transition-colors'>
              <FaBook className='mr-2' size={18} />
              <span>Workshops</span>
            </Link>
            <Link
              to='/activities'
              className='flex items-center px-4 py-2 rounded-md text-lg font-medium text-[#4b5161] dark:text-[#fdf5eb] hover:text-[#f58b44] transition-colors'>
              <FaDumbbell className='mr-2' size={18} />
              <span>Activities</span>
            </Link>
            <Link
              to='/about'
              className='flex items-center px-4 py-2 rounded-md text-lg font-medium text-[#4b5161] dark:text-[#fdf5eb] hover:text-[#f58b44] transition-colors'>
              <FaUsers className='mr-2' size={18} />
              <span>About Us</span>
            </Link>
          </div>

          <div className='flex items-center pr-4 sm:pr-6 lg:pr-8'>
            <button
              onClick={() => setColorTheme(colorTheme)}
              className='p-2 rounded-full text-[#4b5161] dark:text-[#fdf5eb] hover:bg-[#fdf5eb] dark:hover:bg-[#4b5161] transition-colors'
              aria-label={
                colorTheme === 'light' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
              }>
              {colorTheme === 'light' ? (
                <MdOutlineLightMode size={24} />
              ) : (
                <MdOutlineDarkMode size={24} />
              )}
            </button>
            <div className='ml-3'>
              <WalletProfile />
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='lg:hidden p-2 ml-3 rounded-md text-[#4b5161] dark:text-[#fdf5eb] hover:bg-[#fdf5eb] dark:hover:bg-[#4b5161] transition-colors'
              aria-label='Toggle menu'>
              {isMenuOpen ? <MdClose size={26} /> : <MdMenu size={26} />}
            </button>
          </div>
        </div>
      </nav>
      <div className='h-16'></div>
    </>
  )
}

export default Navbar

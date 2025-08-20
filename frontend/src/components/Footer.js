import React from 'react'
import { Link } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-[#4b5161] text-[#fdf5eb]'>
      <div className='container mx-auto py-6 px-8'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <Link to='/' className='flex items-center gap-2'>
              <span className='font-bold text-xl'>
                Mind<span className='text-[#f58b44]'>Chain</span>
              </span>
            </Link>
          </div>
          <p className='text-sm font-medium hidden sm:block'>
            © {currentYear} MindChain. All rights reserved.
          </p>
          <div className='flex space-x-3'>
            <a
              href='https://github.com/khushalmidha/MindChain'
              target='_blank'
              rel='noopener noreferrer'
              className='w-9 h-9 flex items-center justify-center bg-[#fdf5eb] text-[#4b5161] hover:bg-[#f58b44] hover:text-white rounded-full transition-all duration-200'>
              <FaGithub size={18} />
            </a>
          </div>
        </div>
        <div className='mt-3 text-center sm:hidden'>
          <p className='text-xs'>© {currentYear} MindChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

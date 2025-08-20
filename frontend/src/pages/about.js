import React from 'react'
import { FaGithub, FaLinkedin, FaUser } from 'react-icons/fa'

const About = () => {

  const person = {
  name: 'Khushal Midha',
  role: 'Web Developer',
  description: 'Full-stack developer focusing on frontend and blockchain integrations.',
  github: 'https://github.com/khushalmidha',
  linkedin: 'https://www.linkedin.com/in/khushal-midha-260bb3288/',
};

  return (
    <div className='min-h-screen dark:bg-gray-800 text-[#4b5161] dark:text-[#fdf5eb]'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-20'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold tracking-tight mb-4'>
            About <span className='text-[#f58b44]'>MindChain</span>
          </h1>
          <p className='max-w-2xl mx-auto text-lg'>
            MindChain combines blockchain with mental wellness to create a rewarding mindfulness experience.
          </p>
        </div>
        <div className='py-2 flex flex-col items-center'>
          <h2 className='text-2xl font-bold mb-6 text-center'>About Me</h2>
          <div className='w-full max-w-md bg-white dark:bg-[#4b5161] rounded-lg overflow-hidden shadow-md hover:shadow-lg flex flex-col items-center'>
            <div className='w-full flex flex-col items-center bg-[#f58b44] py-8'>
              <div className='w-24 h-24 rounded-full bg-[#fdf5eb] dark:bg-[#4b5161] flex items-center justify-center border-4 border-white mb-4'>
                <FaUser size={40} className='text-[#4b5161] dark:text-[#fdf5eb]' />
              </div>
              <h3 className='text-2xl font-bold text-white'>{person.name}</h3>
              <p className='text-[#fdf5eb] font-medium'>{person.role}</p>
            </div>
            <div className='p-6 w-full flex flex-col items-center'>
              <p className='mb-6 text-center'>{person.description}</p>
              <div className='flex space-x-4'>
                <a
                  href={person.github}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-[#fdf5eb] dark:bg-[#4b5161] hover:bg-[#f58b44] text-[#4b5161] dark:text-[#fdf5eb] hover:text-white p-3 rounded-full transition-colors'>
                  <FaGithub size={22} />
                </a>
                <a
                  href={person.linkedin}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-[#fdf5eb] dark:bg-[#4b5161] hover:bg-[#f58b44] text-[#4b5161] dark:text-[#fdf5eb] hover:text-white p-3 rounded-full transition-colors'>
                  <FaLinkedin size={22} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

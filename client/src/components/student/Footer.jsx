import React from 'react'
import { GraduationCap } from 'lucide-react';


const Footer = () => {
  return (
     <div className='pt-10 px-4 md:px-20 lg:px-32
        bg-gray-900 w-full overflow-hidden' id='Footer'>
          
          <div className='Container mx-auto grid 
          grid-cols-1 md:grid-cols-4 gap-10'>

            {/* Left About Section */}
            <div className='w-full'>
              <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-400 to-blue-500 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="bg-linear-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
              EduSmart
            </span>
          </div>
              <p className='text-gray-400 mt-4'>
                Empowering learners worldwide with high-quality online education.
                 Your journey to success starts here.
              </p>
            </div>

            {/* Company Section */}
            <div className='w-full'>
              <h3 className='text-white text-lg font-bold mb-4'>Quick Links</h3>
              <ul className='flex flex-col gap-2 text-gray-400'>
                <a href="#Header" className='hover:text-white'>Home</a>
                <a href="#About" className='hover:text-white'>About Us</a>
                <a href="#Projects" className='hover:text-white'>Contact Us</a>
                <a href="#" className='hover:text-white'>Privacy Policy</a>  
              </ul>
            </div>

            {/* ⭐ Categories Section (New Grid Added) */}
            <div className='w-full'>
              <h3 className='text-white text-lg font-bold mb-4'>Categories</h3>
              <ul className='flex flex-col gap-2 text-gray-400'>
                <a href="#" className='hover:text-white'>Programming</a>
                <a href="#" className='hover:text-white'>Business</a>
                <a href="#" className='hover:text-white'>Design</a>
                <a href="#" className='hover:text-white'>Marketing</a>
              </ul>
            </div>

            {/* Subscribe Section */}
            <div className='w-full'>
              <h3 className='text-white text-lg font-bold mb-4'>
                Subscribe to our newsletter
              </h3>
              <p className='text-gray-400 max-w-80 mb-4'>
                The latest news, articles, and resources, 
                sent to your inbox weekly.
              </p>

              <div className='flex gap-2'>
                <input 
                  className='rounded p-2 bg-gray-800 text-white w-full border border-gray-700
                  focus:outline-none md:w-auto' 
                  type="text" 
                  placeholder='Enter your email'
                />
                <button className='py-2 px-4 text-white bg-blue-700 rounded'>
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className='border-t border-gray-700 py-4 mt-10
          text-center text-gray-500'>
            Copyright 2025 © GreatStack. All Right Reserved.
          </div>

        </div>
  )
}

export default Footer

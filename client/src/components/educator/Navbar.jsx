import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { Bell } from 'lucide-react';

const Navbar = () => {
  const [menuopen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleScroll = (section) => {
    navigate('/');
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className='bg-white/95 py-2 sticky top-0 z-50 w-full shadow-xl'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>

          {/* Logo */}
          <Link to="/educator/educator" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-400 to-blue-500 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="bg-linear-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent font-semibold text-lg">
              Educator Dashboard
            </span>
          </Link>

          {/* Bell Notification */}
          <div className="flex gap-2 items-center relative">
            <button className='bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors relative'>
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                3
              </span>
            </button>

          {/* Profile Menu */}
            <div className="flex items-center gap-2">
                <div className="size-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
                  JD
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-600">Educator</p>
                </div>
              <div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
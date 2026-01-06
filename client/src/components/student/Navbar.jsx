import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User, ChevronDown, GraduationCap } from 'lucide-react';
import { useAuth } from '../../Auth/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuopen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { name: "Home", link: "home" },
    { name: "Courses", link: "course-list" },
    { name: "Categories", link: "categories" },
    { name: "About", link: "about" },
    { name: "Contact", link: "contact" },
  ];

  const handleScroll = (section) => {
    navigate('/');
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const handleLogout = async () => {
    await logout(); // Calls the logout from your AuthContext
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <div className='bg-white/95 py-2 sticky top-0 z-50 w-full shadow-xl'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-400 to-blue-500 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-linear-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
              EduSmart
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item, index) => (
              item.name === "Home" ? (
                <button
                  key={index}
                  onClick={() => handleScroll("home")}
                  className="text-gray-700 hover:text-indigo-500 font-medium transition-colors"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={index}
                  to={`/${item.link}`}
                  className="text-gray-700 hover:text-indigo-500 font-medium transition-colors"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Auth Buttons / Profile Dropdown */}
          <div className="hidden md:flex gap-3 items-center">
            {!user ? ( // Condition: If user is null, show login/signup
              <>
                <Link to="/login">
                  <button className="text-gray-500 hover:text-indigo-500 px-3 py-1.5 rounded-md font-medium">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:scale-105 transition-all shadow-md">
                    Signup
                  </button>
                </Link>
              </>
            ) : ( // If user is logged in, show Profile Icon
              <div className='relative' ref={dropdownRef}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className='flex items-center gap-2 p-1 pr-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all border border-gray-200 shadow-sm'
                >
                  <div className='w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white'>
                    <User size={18} />
                  </div>
                  <ChevronDown size={16} className={`text-gray-600 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {profileOpen && (
                  <div className='absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in duration-200'>
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold truncate text-gray-700">{user.email || 'User'}</p>
                    </div>

                    <Link 
                      to='/profile' 
                      className='flex items-center gap-3 py-2.5 px-4 text-gray-700 hover:bg-indigo-50 transition-colors'
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={18} className="text-indigo-500" />
                      <span className='font-medium text-sm'>My Profile</span>
                    </Link>

                    <Link 
                      to="/course-management" 
                      className='flex items-center gap-3 py-2.5 px-4 text-gray-700 hover:bg-indigo-50 transition-colors'
                      onClick={() => setProfileOpen(false)}
                    >
                      <BookOpen size={18} className="text-indigo-500" />
                      <span className='font-medium text-sm'>Course Management</span>
                    </Link>

                    <div className='border-t border-gray-100 my-1'></div>

                    <button
                      onClick={handleLogout}
                      className='w-full text-left flex items-center gap-3 py-2.5 px-4 text-red-600 hover:bg-red-50 transition-colors'
                    >
                      <LogOut size={18} />
                      <span className='font-medium text-sm'>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMenuOpen(!menuopen)} className='md:hidden p-2'>
            {menuopen ? <span className="text-2xl">✕</span> : <span className="text-2xl">☰</span>}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuopen && (
          <div className="md:hidden flex flex-col items-center gap-4 bg-white py-6 rounded-b-2xl border-t border-gray-50 shadow-inner">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={`/${item.link}`}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 text-lg font-medium hover:text-indigo-500"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth/Profile */}
            {!user ? (
              <div className="flex flex-col w-full px-10 gap-2 mt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-center py-2 text-indigo-500 font-bold border border-indigo-500 rounded-full">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="text-center py-2 bg-indigo-500 text-white rounded-full">Signup</Link>
              </div>
            ) : (
              <div className="flex flex-col w-full px-10 gap-3 mt-2 border-t pt-4">
                 <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium text-center">My Profile</Link>
                 <Link to="/course-management" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium text-center">Course Management</Link>
                 <button onClick={handleLogout} className="text-red-500 font-bold">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
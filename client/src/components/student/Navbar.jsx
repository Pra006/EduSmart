import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LogOut,
  User,
  ChevronDown,
  GraduationCap,
  Bell,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuopen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);


  const [showNotification, setShowNotification] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);        
  const notificationRef = useRef(null);    

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/notifications");
        const unread = res.data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnreadCount();
  }, []);

  const menuItems = [
    { name: "Home", link: "home" },
    { name: "Courses", link: "course-list" },
    { name: "About", link: "about" },
    { name: "Contact", link: "contact" },
    { name: "Instructor", link: "instructor" },
  ];

  const handleScroll = (section) => {
    navigate("/");
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <div className="bg-white/95 py-2 sticky top-0 z-50 w-full shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
              EduSmart
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item, index) => {
              if (item.name === "Home") {
                return (
                  <button
                    key={index}
                    onClick={() => handleScroll("home")}
                    className="text-gray-700 hover:text-indigo-500 font-medium"
                  >
                    {item.name}
                  </button>
                );
              }

              if (item.name === "Instructor") {
                return (
                  <button
                    key={index}
                    onClick={() => navigate("/login")}
                    className="text-gray-700 hover:text-indigo-500 font-medium"
                  >
                    {item.name}
                  </button>
                );
              }

              return (
                <Link
                  key={index}
                  to={`/${item.link}`}
                  className="text-gray-700 hover:text-indigo-500 font-medium"
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* AUTH SECTION */}
          <div className="hidden md:flex gap-3 items-center">
            {!user ? (
              <>
                <Link to="/login">
                  <button className="text-gray-500 hover:text-indigo-500">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-indigo-500 text-white px-5 py-2 rounded-full">
                    Signup
                  </button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">

                {/* 🔔 NOTIFICATION (ONLY THIS PART IS NEW) */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotification(prev => !prev)}
                    className="bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors relative"
                  >
                    <Bell className="w-6 h-6 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotification && (
                    <NotificationDropdown
                      onClose={() => setShowNotification(false)}
                    />
                  )}
                </div>

                {/* 👤 PROFILE DROPDOWN — UNCHANGED */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all border border-gray-200 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                      <User size={18} />
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 py-2">
                      <div className="px-4 py-2 border-b">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold truncate">
                          {user.fullname || user.email}
                        </p>
                      </div>

                      <Link
                        to="/my-profile"
                        className="flex items-center gap-3 py-2.5 px-4 hover:bg-indigo-50"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User size={18} />
                        My Profile
                      </Link>

                      <Link
                        to="/my-courses"
                        className="flex items-center gap-3 py-2.5 px-4 hover:bg-indigo-50"
                        onClick={() => setProfileOpen(false)}
                      >
                        <BookOpen size={18} />
                        My Learning
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 py-2.5 px-4 text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

import React, { useState } from 'react';
import Dashboard from './Dashboard';
import EducatorApproval from './EducatorApproval';
import { LayoutDashboard, Users, BookOpen, Bell, FileText, Settings, Moon, Sun, LogOut, Menu, X } from 'lucide-react';

export function Sidebar({
  activeView,
  setActiveView,
  darkMode,
  toggleDarkMode,
  pendingEducators,
  pendingCourses,
  unreadNotifications,
  isOpen,
  setIsOpen
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'educators', label: 'Educator Approvals', icon: Users, badge: pendingEducators },
    { id: 'courses', label: 'Course Management', icon: BookOpen, badge: pendingCourses },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
  ];

  const handleMenuClick = (id) => {
    setActiveView(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm sm:text-base"
          >
            {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
            <span>{darkMode ? 'Light' : 'Dark'}</span>
          </button>

          <button className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm sm:text-base">
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span>Settings</span>
          </button>

          <button className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm sm:text-base">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default function Admin() {
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDarkMode = () => setDarkMode((v) => !v);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          pendingEducators={0}
          pendingCourses={0}
          unreadNotifications={0}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-auto">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
            <div className="w-10" />
          </div>
          
          {/* Main Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'educators' && <EducatorApproval />}
            {activeView !== 'dashboard' && activeView !== 'educators' && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{activeView}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Content for {activeView} goes here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import Dashboard from './Dashboard';
import EducatorApproval from './EducatorApproval';
import { LayoutDashboard, Users, BookOpen,Bell,FileText,Settings,Moon,Sun,LogOut} from 'lucide-react';
export function Sidebar({
  activeView,
  setActiveView,
  darkMode,
  toggleDarkMode,
  pendingEducators,
  pendingCourses,
  unreadNotifications
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'educators', label: 'Educator Approvals', icon: Users, badge: pendingEducators },
    { id: 'courses', label: 'Course Management', icon: BookOpen, badge: pendingCourses },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          LMS Admin
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((v) => !v);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          pendingEducators={0}
          pendingCourses={0}
          unreadNotifications={0}
        />
        <main className="flex-1 p-6">
          {activeView === 'dashboard' && <Dashboard />}
          {activeView === 'educators' && <EducatorApproval />}
          {activeView !== 'dashboard' && activeView !== 'educators' && (
            <div className="p-4">
              <h2 className="text-lg font-medium">{activeView}</h2>
              <p className="text-sm text-gray-600">Content for {activeView} goes here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

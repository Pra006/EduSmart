import { TowerControl, ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import StatCard from '../../components/admin/StatCard'
import StudentDashboard from './StudentDashboard'
import EducatorDashboard from './EducatorDashboard'

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const stats = {
    totalEnrollments: 120,
    totalStudents: 85,
    totalRevenue: 150000,
  };
  const enrollments = [
    {
      id:1,
      studentName: "John Doe",
      courseName: "React for Beginners",
      price: 49.99,
      enrolledAt: "2024-06-15 10:30 AM"
    },
    {
      id:2,
      studentName: "Jane Smith",
      courseName: "Advanced Node.js",
      price: 79.99,
      enrolledAt: "2024-06-14 02:15 PM"
    },
    {
      id:3,
      studentName: "Alice Johnson",
      courseName: "Python Data Science",
      price: 59.99,
      enrolledAt: "2024-06-13 11:00 AM"
    },
  ]
  return (
    <div className='space-y-6 sm:space-y-8'>
      {/* Dropdown Menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className='flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
        >
          <span className='font-medium text-gray-900 dark:text-white'>
            {activeView === 'overview' ? 'Overview' : activeView === 'students' ? 'Student Dashboard' : 'Educator Dashboard'}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Content */}
        {dropdownOpen && (
          <div className='absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10'>
            <button
              onClick={() => {
                setActiveView('overview');
                setDropdownOpen(false);
              }}
              className={`w-full text-left px-4 py-2 transition-colors ${
                activeView === 'overview'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setActiveView('students');
                setDropdownOpen(false);
              }}
              className={`w-full text-left px-4 py-2 border-t border-gray-200 dark:border-gray-700 transition-colors ${
                activeView === 'students'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Student Dashboard
            </button>
            <button
              onClick={() => {
                setActiveView('educators');
                setDropdownOpen(false);
              }}
              className={`w-full text-left px-4 py-2 border-t border-gray-200 dark:border-gray-700 transition-colors rounded-b-lg ${
                activeView === 'educators'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Educator Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Overview Content */}
      {activeView === 'overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <StatCard title="Total Enrollments" value={stats.totalEnrollments} />
            <StatCard title="Total Students" value={stats.totalStudents} />
            <StatCard
              title="Total Revenue"
              value={`$ ${stats.totalRevenue}`}
            />
          </div>

          <div className='bg-white dark:bg-gray-900 shadow-md p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-800'>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4'>Recent Enrollments</h2>
            <div className='overflow-x-auto -mx-4 sm:mx-0'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
                    <th className='py-3 px-4 font-semibold text-gray-900 dark:text-gray-100'>Student name</th>
                    <th className='py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 hidden sm:table-cell'>Course name</th>
                    <th className='py-3 px-4 font-semibold text-gray-900 dark:text-gray-100'>Price</th>
                    <th className='py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 hidden md:table-cell'>Enrolled Time</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e, index) => (
                    <tr key={e.id} className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${
                      index % 2 === 0 
                        ? 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800' 
                        : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}>
                      <td className='py-3 px-4 text-gray-800 dark:text-gray-200 font-medium'>{e.studentName}</td>
                      <td className='py-3 px-4 text-gray-800 dark:text-gray-200 hidden sm:table-cell'>{e.courseName}</td>
                      <td className='py-3 px-4 text-gray-800 dark:text-gray-200 font-medium'>${e.price}</td>
                      <td className='py-3 px-4 text-gray-800 dark:text-gray-200 hidden md:table-cell text-xs sm:text-sm'>{e.enrolledAt}</td>
                    </tr> 
                  ))}   
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Student Dashboard */}
      {activeView === 'students' && <StudentDashboard />}

      {/* Educator Dashboard */}
      {activeView === 'educators' && <EducatorDashboard />}
    </div>
  )
}

export default Dashboard

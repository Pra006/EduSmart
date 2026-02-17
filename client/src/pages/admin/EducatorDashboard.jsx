import React from 'react';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';

const EducatorDashboard = () => {
  const educatorStats = {
    totalEducators: 18,
    activeEducators: 14,
    totalCourses: 42,
    averageRating: 4.7,
  };

  const educatorData = [
    {
      id: 1,
      name: "Prof. Sarah Williams",
      email: "sarah@example.com",
      courses: 4,
      students: 156,
      rating: 4.8,
      status: "Approved"
    },
    {
      id: 2,
      name: "Mark Brown",
      email: "mark@example.com",
      courses: 3,
      students: 98,
      rating: 4.6,
      status: "Approved"
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      email: "emily@example.com",
      courses: 5,
      students: 234,
      rating: 4.9,
      status: "Approved"
    },
    {
      id: 4,
      name: "James Miller",
      email: "james@example.com",
      courses: 2,
      students: 67,
      rating: 4.5,
      status: "Pending"
    },
  ];

  return (
    <div className='space-y-6 sm:space-y-8'>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          title="Total Educators" 
          value={educatorStats.totalEducators}
          icon={<Users className="w-8 h-8 text-blue-500" />}
        />
        <StatCard 
          title="Active Educators" 
          value={educatorStats.activeEducators}
          icon={<TrendingUp className="w-8 h-8 text-green-500" />}
        />
        <StatCard 
          title="Total Courses" 
          value={educatorStats.totalCourses}
          icon={<BookOpen className="w-8 h-8 text-orange-500" />}
        />
        <StatCard 
          title="Avg Rating" 
          value={`${educatorStats.averageRating} ★`}
          icon={<Award className="w-8 h-8 text-yellow-500" />}
        />
      </div>

      {/* Educators Table */}
      <div className='bg-white dark:bg-gray-900 shadow-md p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-800'>
        <div className="flex items-center justify-between mb-4">
          <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-white'>Educator List</h2>
          <button className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm'>
            Export
          </button>
        </div>
        
        <div className='overflow-x-auto -mx-4 sm:mx-0'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
                <th className='py-3 px-4 font-semibold text-gray-900 dark:text-gray-100'>Name</th>
                <th className='py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 hidden sm:table-cell'>Email</th>
                <th className='py-3 px-4 font-semibold text-gray-900 dark:text-gray-100'>Courses</th>
                <th className='py-3 px-4 font-semibold text-gray-900 dark:text-gray-100 hidden md:table-cell'>Students</th>
                <th className='py-3 px-4 font-semibold text-gray-900 dark:text-gray-100'>Rating</th>
                <th className='py-3 px-4 font-semibold text-gray-900 dark:text-gray-100'>Status</th>
              </tr>
            </thead>
            <tbody>
              {educatorData.map((educator, index) => (
                <tr key={educator.id} className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${
                  index % 2 === 0 
                    ? 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800' 
                    : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}>
                  <td className='py-3 px-4 text-gray-800 dark:text-gray-200 font-medium'>{educator.name}</td>
                  <td className='py-3 px-4 text-gray-800 dark:text-gray-200 hidden sm:table-cell text-xs sm:text-sm'>{educator.email}</td>
                  <td className='py-3 px-4 text-gray-800 dark:text-gray-200'>{educator.courses}</td>
                  <td className='py-3 px-4 text-gray-800 dark:text-gray-200 hidden md:table-cell'>{educator.students}</td>
                  <td className='py-3 px-4'>
                    <div className="flex items-center gap-1">
                      <span className='text-gray-800 dark:text-gray-200 font-medium'>{educator.rating}</span>
                      <span className='text-yellow-500'>★</span>
                    </div>
                  </td>
                  <td className='py-3 px-4'>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      educator.status === 'Approved' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {educator.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EducatorDashboard;

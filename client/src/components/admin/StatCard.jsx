import React from 'react'

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2 truncate">{title}</h3>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">{value}</p>
    </div>
  )
}

export default StatCard

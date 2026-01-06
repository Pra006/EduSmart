import React from 'react'
import Quickaction from '../../components/educator/Quickaction'
import EnrollmentView from '../../components/educator/EnrollmentView'
import CoursePerformance from '../../components/educator/oursePerformance'
import ReacentActivity from '../../components/educator/ReacentActivity'

const Dashboard = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div>
          <h2 className='font-bold text-3xl text-gray-900'>Hello, Educator</h2>
          <p className=' text-gray-600'>Empower students with engaging learning experiences. Create new courses, monitor progress, and lead the way in education excellence.</p>
        </div>
        <div>
          <Quickaction />
        </div>
        <div className='mt-6'>
           <EnrollmentView/>
        </div>
        <div className='mt-8'>
          <CoursePerformance />
        </div>
           <div className='mt-8'>
          <ReacentActivity/>
        </div>
    </div>
  )
}

export default Dashboard
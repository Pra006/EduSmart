import React from 'react'
import { useState } from 'react'
import Courses from '../../components/student/Courses';
import CourseCard from '../../components/student/CourseCard';
import SearchBar from '../../components/student/SearchBar';
import Footer from '../../components/student/Footer';

const CoursesList = () => {
  const categories = ['All Courses', 'Programming', 'Business', 'Design', 'Marketing', 'Legal Studies', 'Language']
  const [selectedCategory, setSelectedCategory] = useState('All Courses');
  const filteredCourses = selectedCategory === 'All Courses' ? Courses
    : Courses.filter((course) => course.category === selectedCategory)


  return (
    <div className='min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-blue-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/*Header*/}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>All Courses</h1>
          <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
            Explore our complete collection of courses and find the perfect one for your learning journey.
          </p>
        </div>

        {/* Courses Category */}
        <div className='mb-10'>
          <div className='flex flex-wrap justify-center gap-3'>
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 lg:px-6 py-2 rounded-lg border text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md hover:bg-indigo-700"
                      : "bg-white border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-sm"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
          {/* Search Bar*/}
            <SearchBar/>
        </div>
        {<CourseCard/>}
      </div>
      <Footer/>
    </div>
  )
}

export default CoursesList
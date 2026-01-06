import React from 'react'
import { Users, TrendingUp } from 'lucide-react';
import {useNavigate} from 'react-router-dom';



const EnrollmentView = () => {
  const navigate = useNavigate();
  const courses = [
    { id: 1, name: "Introduction to Web Development", students: 145, change: "+12", trend: "up" },
    { id: 2, name: "Advanced React Patterns", students: 89, change: "+8", trend: "up" },
    { id: 3, name: "Data Structures & Algorithms", students: 203, change: "+25", trend: "up" },
    { id: 4, name: "Mobile App Development", students: 67, change: "+5", trend: "up" },
    { id: 5, name: "UX/UI Design Fundamentals", students: 122, change: "+15", trend: "up" },
    { id: 6, name: "Python for Data Science", students: 178, change: "+19", trend: "up" },
  ];

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);

  const handleChange = ()=>{
    navigate('/educator/student-enrolled');

  }

  return (
    <div>
      <div className='mb-4'>
        <h2>Student Enrollment Overview</h2>
        <p>track student enrollments across all your courses</p>
      </div>
      {/* Total students Card */}
  <div className='mb-6 border border-blue-200 bg-blue-50 rounded-lg p-6'>
  <div className='flex items-start justify-between'>
    <div>
      <p className='text-sm text-blue-600 mb-2'>Total Students Enrolled</p>
      <p className='text-4xl font-bold text-blue-900'>{totalStudents}</p>
      <p className='text-sm text-blue-600 mt-2 flex items-center gap-1'>
        <TrendingUp className='w-4 h-4' />
        +84 this month
      </p>
    </div>
    <div className='bg-blue-600 p-4 rounded-full'>
      <button onClick={()=>handleChange()}>
      <Users className='w-8 h-8 text-white' />
      </button>
    </div>
  </div>
</div>

      {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 space-x-6 mt-2">
        {courses.map((course) => (
          <div key={course.id} className="hover:shadow-lg transition-shadow">
            <div>
              <h1 className="text-lg capitalize font-semibold">{course.name}</h1>
              <p>Course ID: EDU-{course.id.toString().padStart(3, "0")}</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{course.students}</p>
                  <p className="text-sm text-gray-600">Students enrolled</p>
                </div>
                <div className="bg-green-100 text-green-700">
                  {course.change} new
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default EnrollmentView
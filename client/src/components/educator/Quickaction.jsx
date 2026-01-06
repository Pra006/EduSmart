import { PlusCircle, Edit, MessageSquare, BarChart, FileText, Settings } from 'lucide-react'
import React from 'react'
import EnrollmentView from './EnrollmentView'
import { useNavigate } from 'react-router-dom'

const Quickaction = () => {
    const navigate = useNavigate();
    const handleNewCourse = () => {
        navigate('/educator/new-course');
    };
    return (
        <>
        <div className='mt-2 border-2 border-dashed border-gray-300 rounded-lg bg-white shadow-sm'>
            <div className='pt-6'>
                <div className='mb-4 px-6'>
                    <h3 className='text-gray-900 text-lg font-semibold'>Quick Actions</h3>
                    <p className='text-gray-600 text-sm'>Manage your courses and communicate with students</p>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 px-6 pb-6'>
                    <button onClick={handleNewCourse} className='flex flex-col items-center gap-2 py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors'>
                        <PlusCircle className='w-5 h-5' />
                        <span className='text-sm font-medium'>New Course</span>
                    </button>
                    <button onClick={()=>{ navigate('/educator/courses')}}  className='flex flex-col items-center gap-2 py-4 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors'>
                        <Edit className='w-5 h-5' />
                        <span className='text-sm font-medium'>Courses</span>
                    </button>
                    <button className='flex flex-col items-center gap-2 py-4 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors'>
                        <MessageSquare className='w-5 h-5' />
                        <span className='text-sm font-medium'>Message Students</span>
                    </button>
                    <button className='flex flex-col items-center gap-2 py-4 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors'>
                        <BarChart className='w-5 h-5' />
                        <span className='text-sm font-medium'>View Analytics</span>
                    </button>
                    <button className='flex flex-col items-center gap-2 py-4 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors'>
                        <FileText className='w-5 h-5' />
                        <span className='text-sm font-medium'>Grade Assignments</span>
                    </button>
                    <button className='flex flex-col items-center gap-2 py-4 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors'>
                        <Settings className='w-5 h-5' />
                        <span className='text-sm font-medium'>Course Settings</span>
                    </button>
                </div>
            </div>
        </div>
       
        </>
    )
}

export default Quickaction
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, PlayCircle, BookOpen } from 'lucide-react';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;

   useEffect(() => {
        // 1. Identify User
        const currentUser = JSON.parse(localStorage.getItem("activeUser") || "{}");
        const userId = currentUser.email || currentUser.id || "guest";
        const userStorageKey = `mycourses_${userId}`;

        // 2. Load Existing Data
        const storedCourses = JSON.parse(localStorage.getItem(userStorageKey) || "[]");
        let updatedList = [...storedCourses];

        // 3. Process New Enrollment from PaymentSuccess
        if (state && state.courseId && state.transactionId) {
            const isDuplicate = storedCourses.some(item => item.id === state.courseId);

            if (!isDuplicate) {
                const newCourse = {
                    id: state.courseId,
                    name: state.courseName || "Untitled Course", 
                    instructor: state.instructor || "Expert Instructor",
                    thumbnail: state.thumbnail || "https://via.placeholder.com/300",
                    category: state.category || "General",
                    date: new Date().toLocaleDateString(),
                };

                updatedList = [newCourse, ...storedCourses];
                localStorage.setItem(userStorageKey, JSON.stringify(updatedList));
            }
        }

        // 4. Update UI State
        setCourses(updatedList);

        // 5. Clean up URL state so refresh doesn't duplicate logic
        window.history.replaceState({}, document.title);

    }, [state]);

    const handleStartCourse = (course) => {
        navigate('/course-player', { state: { course } });
    };

    return (
        <div className='min-h-screen bg-gray-50 py-10'>
            {/* Header Section */}
            <div className='bg-white border-b border-gray-200'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                        <div>
                            <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>My Learning</h1>
                            <p className='text-gray-500 mt-1 font-medium'>Welcome back! Here are your enrolled courses.</p>
                        </div>
                        <div className='flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-5 py-2.5 rounded-2xl'>
                            <Award className='w-6 h-6 text-indigo-600' />
                            <span className='text-indigo-700 font-bold'>{courses.length} Courses</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
                {courses.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                        <BookOpen className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-700">No courses found</h2>
                        <p className="text-gray-500 mt-2">You haven't enrolled in any courses yet.</p>
                        <button 
                            onClick={() => navigate('/course-list')}
                            className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all"
                        >
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {courses.map((course) => (
                            <div key={course.id} className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group'>
                                <div className='relative h-52 overflow-hidden'>
                                    <img 
                                        src={course.thumbnail} 
                                        alt={course.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                                        {course.category}
                                    </div>
                                </div>
                                
                                <div className='p-6'>
                                    <h2 className='text-xl font-bold text-gray-900 mb-1 line-clamp-1'>
                                        {course.name} 
                                    </h2>
                                    <p className="text-gray-500 text-sm mb-6 flex items-center gap-1">
                                        <span>By</span> <span className="font-semibold text-gray-700">{course.instructor}</span>
                                    </p>
                                    
                                    <button 
                                        onClick={() => handleStartCourse(course)} 
                                        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-colors"
                                    >
                                        <PlayCircle size={20} />
                                        Start Learning
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;
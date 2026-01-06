import React, { useEffect, useState } from 'react';
import { Star, Clock, Users, BookOpen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios

const CourseCard = () => {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/course/all");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching dynamic courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      Programming: 'bg-blue-100 text-blue-700',
      Business: 'bg-green-100 text-green-700',
      Design: 'bg-purple-100 text-purple-700',
      Marketing: 'bg-orange-100 text-orange-700',
      'Legal Studies': 'bg-red-100 text-red-700',
      Language: 'bg-pink-100 text-pink-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Popular Courses
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Discover our most-loved courses and start learning today
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* 4. Map over the state 'courses' instead of static file */}
          {courses.map((courseItem) => (
            <div
              key={courseItem._id} // MongoDB uses _id
              className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col group"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden">
                <Link to={`/Course/${courseItem._id}`}>
                  <img
                    src={courseItem.thumbnail}
                    alt={courseItem.title}
                    className="w-full h-48 sm:h-52 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getCategoryColor(courseItem.category)}`}>
                    {courseItem.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg shadow-md">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-800">{courseItem.rating}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 flex flex-col grow">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {courseItem.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>by {courseItem.instructor}</span>
                </p>

                {/* Course Stats */}
                <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-600 mb-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{courseItem.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{(courseItem.students || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {/* Access length of lessons array from DB */}
                    <span>{courseItem.lessons?.length || 0} lessons</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-center">
                  <Link to={`/Course/${courseItem._id}`}>
                    <button className='bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-all'>
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
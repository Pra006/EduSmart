import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Award, PlayCircle, BookOpen, RefreshCw } from "lucide-react";
import axios from "axios";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({}); 
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  // Load courses from localStorage or state
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userStorageKey = `mycourses_${userId}`;

    const storedCourses = JSON.parse(localStorage.getItem(userStorageKey) || "[]");
    let updatedList = [...storedCourses];

    if (state && state.courseId && state.transactionId) {
      const isDuplicate = storedCourses.some((item) => item.id === state.courseId);

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

    setCourses(updatedList);
    window.history.replaceState({}, document.title);
  }, [state]);

  // Fetch real-time progress from backend using Axios
  useEffect(() => {
    const fetchProgress = async () => {
      const studentId = localStorage.getItem("userId");
      if (!studentId || courses.length === 0) return;

      const progressData = {};

      try {
        await Promise.all(
          courses.map(async (course) => {
            const courseId = course.id;
            const res = await axios.get(`/api/enrollment/progress/${studentId}/${courseId}`);

            // Store per-course progress with completed lessons
            progressData[courseId] = res.data.success ? {
              totalProgress: res.data.progress,
              completedLessons: res.data.completedLessons
            } : { totalProgress: 0, completedLessons: [] };
          })
        );

        setProgressMap(progressData);
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      }
    };

    fetchProgress();
  }, [courses]);

  const handleStartCourse = (course) => {
    navigate("/course-player", { state: { course } });
  };

  const handleRefreshProgress = async () => {
    const studentId = localStorage.getItem("userId");
    if (!studentId) return;

    const progressData = {};

    try {
      await Promise.all(
        courses.map(async (course) => {
          const courseId = course.id;
          const res = await axios.get(`/api/enrollment/progress/${studentId}/${courseId}`);
          progressData[courseId] = res.data.success ? {
            totalProgress: res.data.progress,
            completedLessons: res.data.completedLessons
          } : { totalProgress: 0, completedLessons: [] };
        })
      );

      setProgressMap(progressData);
    } catch (err) {
      console.error("Error refreshing progress:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                My Learning
              </h1>
              <p className="text-gray-500 mt-1 font-medium">
                Welcome back! Here are your enrolled courses.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-5 py-2.5 rounded-2xl">
              <Award className="w-6 h-6 text-indigo-600" />
              <span className="text-indigo-700 font-bold">{courses.length} Courses</span>
            </div>

            <button 
              onClick={handleRefreshProgress}
              className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-5 py-2.5 rounded-2xl hover:bg-blue-100 transition-all"
            >
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-semibold text-sm">Refresh Progress</span>
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {courses.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
            <BookOpen className="w-20 h-20 text-gray-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700">No courses found</h2>
            <p className="text-gray-500 mt-2">
              You haven't enrolled in any courses yet.
            </p>
            <button
              onClick={() => navigate("/course-list")}
              className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const courseProgressData = progressMap[course.id] || {};
              const progress = courseProgressData.totalProgress || 0;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                      {course.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                      {course.name}
                    </h2>
                    <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                      By <span className="font-semibold text-gray-700">{course.instructor}</span>
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => handleStartCourse(course)}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-white transition-colors ${
                        progress === 100
                          ? "bg-green-600"
                          : "bg-gray-900 hover:bg-indigo-600"
                      }`}
                    >
                      <PlayCircle size={20} />
                      {progress === 100 ? "Completed" : "Continue Learning"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;

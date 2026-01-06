import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; 
import { 
  Star, Clock, Users, BookOpen, Award, PlayCircle, 
  CheckCircle, ArrowLeft, Globe, Target, Loader2 
} from "lucide-react";
// 1. Import your Auth Hook
import { useAuth } from "../../Auth/AuthContext.jsx"; 

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 2. Access the global user state
  const { user } = useAuth(); 

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleEnroll = () => {
    // 3. Updated logic: Check the context 'user' instead of localStorage string
    if (!user) {
      alert("Please log in to enroll in the course.");
      navigate("/login");
      return;
    }

    navigate("/checkoutprocess", {
      state: {
        courseId: courseData._id, 
        courseName: courseData.title,
        coursePrice: courseData.price,
      }
    });
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/course/${id}`);
        
        if (response.data) {
          setCourseData(response.data);
          setError(null);
        } else {
          setError("Course details could not be found.");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load course details from the database.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-700">Loading your course...</p>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50 p-6">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-2 rounded-xl">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} /> <span className="font-medium">Back to Courses</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
              <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                {courseData.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                {courseData.title}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl uppercase">
                  {courseData.instructor?.[0] || "I"}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Instructor</p>
                  <p className="font-bold text-slate-900">{courseData.instructor}</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500 mx-auto mb-1" />
                  <p className="text-xs text-slate-500 uppercase font-bold">Rating</p>
                  <p className="font-black text-slate-900">{courseData.rating || "New"}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                  <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-xs text-slate-500 uppercase font-bold">Students</p>
                  <p className="font-black text-slate-900">{(courseData.students || 0).toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                  <Clock className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-xs text-slate-500 uppercase font-bold">Duration</p>
                  <p className="font-black text-slate-900">{courseData.duration}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-center">
                  <BookOpen className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-xs text-slate-500 uppercase font-bold">Lessons</p>
                  <p className="font-black text-slate-900">{courseData.lessons?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Course Preview */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
              <img src={courseData.thumbnail} alt="Thumbnail" className="w-full object-cover aspect-video group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white p-4 rounded-full shadow-2xl cursor-pointer">
                  <PlayCircle size={48} className="text-blue-600" />
                </div>
              </div>
            </div>

            {/* Mastery Section */}
            {courseData.learn && courseData.learn.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Target className="text-emerald-500" /> What You'll Master
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {courseData.learn.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-10 space-y-6">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 text-white">
                  <p className="text-blue-100 text-sm font-bold uppercase mb-2">Get Full Access</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">${courseData.price}</span>
                    <span className="text-lg line-through opacity-60">${(courseData.price * 1.5).toFixed(0)}</span>
                  </div>
                </div>

                <div className="p-8">
                  <button 
                    onClick={handleEnroll} 
                    className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all hover:scale-[1.02] shadow-xl shadow-emerald-100 mb-6"
                  >
                    Enroll Now
                  </button>

                  <div className="space-y-4">
                    <p className="font-bold text-slate-900">This course includes:</p>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Clock size={18} className="text-blue-500" /> <span>Full Lifetime Access</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Award size={18} className="text-purple-500" /> <span>Certificate of Completion</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Globe size={18} className="text-emerald-500" /> <span>English & Subtitles</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
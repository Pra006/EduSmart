import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Loader2, PlayCircle, User, Clock, Pencil, Trash2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/course/all");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`http://localhost:3000/api/course/delete/${id}`);
        setCourses(courses.filter(course => course._id !== id));
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete the course.");
      }
    }
  };

  // --- EDIT LOGIC ---
  const handleEdit = (course) => {
    // Navigates to your course form and sends the existing data
    navigate("/create-course", { state: { editData: course } });
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-violet-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Published Courses</h1>
          <span className="bg-violet-100 text-violet-700 px-4 py-1 rounded-full text-sm font-semibold">
            Total: {courses.length}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600 text-sm">Course</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm hidden md:table-cell">Instructor</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Duration</th> {/* RESTORED */}
                  <th className="p-4 font-semibold text-slate-600 text-sm">Price</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Video ID</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-12 h-12 md:w-16 md:h-10 object-cover rounded-lg border border-slate-200"
                        />
                        <div className="max-w-[150px] md:max-w-xs">
                          <p className="font-bold text-slate-800 truncate">{course.title}</p>
                        </div>
                      </div>
                    </td>

                    {/* Instructor */}
                    <td className="p-4 hidden md:table-cell text-slate-600 text-sm">
                      <div className="flex items-center gap-2">
                        <User size={14} /> {course.instructor}
                      </div>
                    </td>

                    {/* Duration (RE-INCLUDED) */}
                    <td className="p-4 text-slate-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={14} /> {course.duration}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <span className="font-bold text-emerald-600">${course.price}</span>
                    </td>

                    {/* Video ID */}
                    <td className="p-4">
                      <code className="bg-slate-100 px-2 py-1 rounded text-[10px] text-slate-500 font-mono">
                        {course._id.substring(0, 10)}...
                      </code>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        {/* Play/View */}
                        <button 
                          onClick={() => navigate(`/course/${course._id}`)}
                          className="p-2 text-violet-600 hover:bg-violet-50 rounded-full"
                        >
                          <PlayCircle size={18} />
                        </button>
                        
                        {/* Edit */}
                        <button 
                          onClick={() => handleEdit(course)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-full"
                        >
                          <Pencil size={18} />
                        </button>

                        {/* Delete */}
                        <button 
                          onClick={() => handleDelete(course._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseTable;
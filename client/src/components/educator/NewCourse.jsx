import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Layers,
  BookOpen,
  Upload,
  Image as ImageIcon,
  X,
  Rocket,
  User,
  Tag,
  Loader2
} from "lucide-react";

const EducatorCourseCreator = () => {
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);

  const [courseData, setCourseData] = useState({
    title: "",
    category: "Programming",
    instructor: "",
    rating: 0,
    price: "",
    thumbnail: "",
    duration: "",
    students: 0,
    lessons: [
      {
        id: Date.now(),
        title: "",
        duration: "",
        videoUrl: "",
        videoName: "",
      },
    ],
    learn: [""],
  });

  const categories = [
    "Programming",
    "Business",
    "Design",
    "Marketing",
    "Legal Studies",
    "Language",
  ];

  /* ================= HANDLERS ================= */

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to Base64 so it can be stored permanently in MongoDB
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setCourseData({ ...courseData, thumbnail: reader.result });
    };
  };

  const addLesson = () => {
    setCourseData({
      ...courseData,
      lessons: [
        ...courseData.lessons,
        { id: Date.now(), title: "", duration: "", videoUrl: "", videoName: "" },
      ],
    });
  };

  const updateLesson = (id, field, value) => {
    setCourseData({
      ...courseData,
      lessons: courseData.lessons.map((l) =>
        l.id === id ? { ...l, [field]: value } : l
      ),
    });
  };

  const removeLesson = (id) => {
    setCourseData({
      ...courseData,
      lessons: courseData.lessons.filter((l) => l.id !== id),
    });
  };

  const handleVideoUpload = (id, e) => {
   const file = e.target.files[0];
   if(!file) return;

   if(file.size > 50*1024*1024){
    alert("video is too large. Please upload a file smaller than the 50MB.");
    return;
   }
   const reader = new Filereader();
   reader.readAsDataURL(file);
   reader.onloadstart = () => {
    console.log("Starting Video Conversion....");
   };
   reader.onloadend =() =>{
    setCourseData((prevData)=>({
      ...prevData,
      lessons: prevData.lessons.map((lesson)=>
      (lesson.id === id || lesson._id === id)
      ? {...lesson, videoUrl: reader.result, videoName: file.name}
      : lesson
      )
    }));
    console.log("Video Conversion Complete!")
   };
   reader.onerror = () => {
    alert("Failed to read video file.");
   };
  };

  const updateLearn = (index, value) => {
    const updated = [...courseData.learn];
    updated[index] = value;
    setCourseData({ ...courseData, learn: updated });
  };

  const addLearn = () => {
    setCourseData({ ...courseData, learn: [...courseData.learn, ""] });
  };

  const handlePublish = async () => {
    if (!courseData.title || !courseData.thumbnail || !courseData.instructor || !courseData.price) {
      alert("Please complete all required fields (Title, Thumbnail, Instructor, Price).");
      return;
    }

    setIsPublishing(true);
    try {
      // Ensure this URL matches your backend port (3000 or 5000)
      await axios.post("http://localhost:3000/api/course/create", courseData);
      alert("🚀 Course Created Successfully!");
      navigate("/educator/courses");
    } catch (error) {
      console.error("Publish Error:", error);
      alert("❌ Failed to create course. Check console for details.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12 pb-32">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-10">
        
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full border hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Create New Course</h1>
        </div>

        {/* COURSE OVERVIEW */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 border shadow-sm">
          <h2 className="flex items-center gap-2 text-violet-700 font-bold mb-6">
            <BookOpen size={20} /> Course Overview
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="aspect-video lg:aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50 overflow-hidden relative">
              {courseData.thumbnail ? (
                <>
                  <img src={courseData.thumbnail} className="w-full h-full object-cover" alt="Preview" />
                  <button
                    onClick={() => setCourseData({ ...courseData, thumbnail: "" })}
                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-md hover:bg-red-50"
                  >
                    <X size={18} className="text-red-500" />
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center text-slate-500 hover:text-violet-600 text-center px-4">
                  <ImageIcon size={40} className="mb-2" />
                  <span className="text-sm font-medium">Upload thumbnail</span>
                  <input type="file" accept="image/*" hidden onChange={handleThumbnailChange} />
                </label>
              )}
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Title</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    placeholder="e.g. Advanced Web Development"
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none bg-white appearance-none cursor-pointer"
                      value={courseData.category}
                      onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Instructor Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                      placeholder="Name"
                      value={courseData.instructor}
                      onChange={(e) => setCourseData({ ...courseData, instructor: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Price ($)</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    placeholder="49.99"
                    type="number"
                    value={courseData.price}
                    onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Duration</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    placeholder="e.g. 15 hours"
                    value={courseData.duration}
                    onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CURRICULUM SECTION */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-violet-700 font-bold">
              <Layers size={20} /> Curriculum
            </h2>
            <button
              onClick={addLesson}
              className="flex items-center gap-2 bg-violet-50 text-violet-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-violet-100"
            >
              <Plus size={16} /> Add Lesson
            </button>
          </div>

          <div className="space-y-4">
            {courseData.lessons.map((lesson, index) => (
              <div key={lesson.id} className="relative bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-4">
                    <input
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                      placeholder="Lesson Title"
                      value={lesson.title}
                      onChange={(e) => updateLesson(lesson.id, "title", e.target.value)}
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        className="sm:w-32 px-4 py-2 rounded-lg border border-slate-200 outline-none"
                        placeholder="Duration"
                        value={lesson.duration}
                        onChange={(e) => updateLesson(lesson.id, "duration", e.target.value)}
                      />
                      <label className="flex-1 flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-lg cursor-pointer border hover:border-violet-300 text-sm text-slate-600">
                        <Upload size={16} />
                        <span className="truncate max-w-[150px]">{lesson.videoName || "Upload Video"}</span>
                        <input type="file" accept="video/*" hidden onChange={(e) => handleVideoUpload(lesson.id, e)} />
                      </label>
                    </div>
                  </div>
                  {courseData.lessons.length > 1 && (
                    <button onClick={() => removeLesson(lesson.id)} className="text-slate-300 hover:text-red-500">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LEARN SECTION */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 border shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Rocket size={18} className="text-orange-500" /> What you'll learn
          </h2>
          <div className="space-y-3">
            {courseData.learn.map((item, index) => (
              <input
                key={index}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Key outcome..."
                value={item}
                onChange={(e) => updateLearn(index, e.target.value)}
              />
            ))}
          </div>
          <button onClick={addLearn} className="mt-4 text-sm font-semibold text-violet-600">
            + Add point
          </button>
        </div>

        {/* PUBLISH BUTTON */}
        <div className="flex justify-center pt-8">
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`w-full md:w-auto flex items-center justify-center gap-3 bg-linear-to-r from-violet-600 to-indigo-600 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-lg transition-all ${isPublishing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
          >
            {isPublishing ? (
              <>
                <Loader2 className="animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <Rocket /> Launch Course
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EducatorCourseCreator;
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, PlayCircle, PencilLine, 
    Search, Send, Sparkles, 
    Download, LayoutList, PanelLeftClose, PanelLeftOpen,
    Loader2, Clock, User, AlertCircle, CheckCircle
} from 'lucide-react';
import axios from 'axios';

const CoursePlayer = () => {
    const BASE_URL = "http://localhost:3000"; 
    const location = useLocation();
    const navigate = useNavigate();

    const initialCourse = location.state?.course || null;
    const [courseData, setCourseData] = useState(initialCourse);
    const videoRef = useRef(null);
    const chatEndRef = useRef(null);

    const [activeVideo, setActiveVideo] = useState(null);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [videoError, setVideoError] = useState(null);
    const [note, setNote] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [lessonProgressMap, setLessonProgressMap] = useState({});
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([{ role: 'ai', text: "Ready to help you learn! Ask me anything." }]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const progressInterval = useRef(null);

    /** ================= LOAD FULL COURSE IF NEEDED ================= */
    useEffect(() => {
        const loadFullCourseIfNeeded = async () => {
            if (!courseData) return;
            const hasLessons = Array.isArray(courseData.lessons) && courseData.lessons.length > 0;
            if (!hasLessons) {
                const id = courseData._id || courseData.id;
                try {
                    const res = await fetch(`${BASE_URL}/api/course/${id}`);
                    const full = await res.json();
                    setCourseData(full);
                    return;
                } catch (err) {
                    console.error('Failed to fetch full course:', err);
                }
            }
            if (courseData?.lessons?.length > 0 && !activeVideo) {
                setActiveVideo(courseData.lessons[0]);
            }
        };
        loadFullCourseIfNeeded();
    }, [courseData, activeVideo]);

    /** ================= SCROLL CHAT ================= */
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /** ================= LOAD NOTES ================= */
    useEffect(() => {
        if (!courseData || !activeVideo) return;
        const savedNotes = JSON.parse(localStorage.getItem("course_notes") || "{}");
        const noteKey = `${courseData._id || courseData.id}_${activeVideo._id || activeVideo.title}`;
        setNote(savedNotes[noteKey] || "");
        setIsVideoLoading(true);
        setVideoError(null);
    }, [activeVideo, courseData]);

    /** ================= FETCH PROGRESS ================= */
    useEffect(() => {
        const fetchProgress = async () => {
            const studentId = localStorage.getItem("userId");
            if (!studentId || !courseData) return;
            
            const courseId = courseData._id || courseData.id;
            if (!courseId) {
                console.warn("Course ID is missing from courseData");
                return;
            }
            
            try {
                const res = await axios.get(`${BASE_URL}/api/enrollment/progress/${studentId}/${courseId}`);
                const data = res.data.lessonsProgress || [];
                const progressMap = {};
                data.forEach(item => {
                    const progress = item.duration > 0 ? Math.round((item.watchedSeconds / item.duration) * 100) : 0;
                    progressMap[item.lessonId] = progress;
                });
                setLessonProgressMap(progressMap);
                setCompletedLessons(data.filter(l => l.duration > 0 && l.watchedSeconds >= l.duration).map(l => l.lessonId));
            } catch (err) {
                console.error("Failed to fetch lesson progress", err);
            }
        };
        fetchProgress();
    }, [courseData]);

    /** ================= VIDEO WATCH TRACKING ================= */
    useEffect(() => {
        if (!videoRef.current || !activeVideo || !courseData) return;
        const video = videoRef.current;
        const studentId = localStorage.getItem("userId");
        if (!studentId) return;

        const startTracking = () => {
            progressInterval.current = setInterval(async () => {
                const currentTime = Math.floor(video.currentTime);
                const totalDuration = Math.floor(video.duration || 1); // Avoid division by zero
                const progressPercent = Math.min(Math.round((currentTime / totalDuration) * 100), 100);

                setLessonProgressMap(prev => ({
                    ...prev,
                    [activeVideo._id]: progressPercent
                }));

                if (progressPercent >= 100 && !completedLessons.includes(activeVideo._id)) {
                    setCompletedLessons(prev => [...prev, activeVideo._id]);
                }

                try {
                    await axios.post(`/api/enrollment/update-lesson-progress`, {
                        studentId,
                        courseId: courseData._id,
                        lessonId: activeVideo._id,
                        watchedSeconds: currentTime
                    });
                } catch (err) {
                    if (err.response?.status !== 404) {
                        console.error("Failed to update progress", err.message);
                    }
                }

            }, 5000);
        };

        const stopTracking = () => clearInterval(progressInterval.current);

        video.addEventListener("play", startTracking);
        video.addEventListener("pause", stopTracking);
        video.addEventListener("ended", stopTracking);

        return () => stopTracking();
    }, [activeVideo, courseData, completedLessons]);

    /** ================= HANDLERS ================= */
    const handleSaveNote = (text) => {
        setNote(text);
        setIsSaving(true);
        const savedNotes = JSON.parse(localStorage.getItem("course_notes") || "{}");
        const noteKey = `${courseData._id || courseData.id}_${activeVideo._id || activeVideo.title}`;
        savedNotes[noteKey] = text;
        localStorage.setItem("course_notes", JSON.stringify(savedNotes));
        setTimeout(() => setIsSaving(false), 800);
    };

    const downloadNotes = () => {
        if (!note.trim()) return alert("Notes are empty!");
        const element = document.createElement("a");
        const fileContent = `Course: ${courseData?.title || courseData?.name}\nLesson: ${activeVideo?.title}\n\nNOTES:\n${note}`;
        const file = new Blob([fileContent], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${activeVideo?.title || 'Lesson'}_Notes.txt`;
        document.body.appendChild(element);
        element.click();
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setMessages(prev => [...prev, { role: 'user', text: chatInput }]);
        setChatInput("");
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: `That's a great question about ${activeVideo?.title}! I'm here to help.` }]);
        }, 800);
    };

    const handleVideoLoaded = () => setIsVideoLoading(false);
    const handleVideoError = () => { setIsVideoLoading(false); setVideoError("Unable to load video."); };

    const formatVideoUrl = (url) => {
        if (!url) return "";
        if (url.includes("embed")) return url;
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    };

    const isYouTube = (url) => url && (url.includes("youtube.com") || url.includes("youtu.be"));
    const getFullVideoUrl = (url) => url?.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? url : '/' + url}`;

    if (!courseData) return (
        <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white gap-4">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
            <p className="text-gray-400">Loading course data...</p>
        </div>
    );

    /** ================= RENDER ================= */
    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white font-sans overflow-hidden">
            {/* TOP BAR */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700 z-30 shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6 text-indigo-400" />
                    </button>
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center gap-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-3 py-2 rounded-lg border border-indigo-500/30 transition-all ml-2"
                    >
                        {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                        <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">
                            {isSidebarOpen ? "Lessons" : "Expand"}
                        </span>
                    </button>
                    <h1 className="text-md font-bold hidden md:block border-l border-gray-700 pl-4 ml-2 truncate max-w-[300px]">{courseData?.title || courseData?.name}</h1>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* SIDEBAR */}
                <div className={`bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                    <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex items-center gap-2">
                        <LayoutList className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Course Content</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {courseData?.lessons?.map((lesson, index) => {
                            const lessonId = lesson._id || lesson.id;
                            const progressPercent = lessonProgressMap[lessonId] || 0;
                            const isCompleted = completedLessons.includes(lessonId);

                            return (
                                <button 
                                    key={lessonId || index} 
                                    onClick={() => setActiveVideo(lesson)}
                                    className={`w-full text-left p-4 border-b border-gray-700/30 transition-all ${activeVideo?._id === lessonId ? 'bg-indigo-600/20 border-l-4 border-l-indigo-500' : 'hover:bg-gray-700/40'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <p className={`text-xs ${activeVideo?._id === lessonId ? 'text-white font-bold' : 'text-gray-400'}`}>
                                            {index + 1}. {lesson.title || "Untitled Lesson"}
                                        </p>
                                        {isCompleted && <CheckCircle size={16} className="text-green-500" />}
                                    </div>
                                    <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
                                        <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">{progressPercent}% watched</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* PLAYER AREA */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-black">
                    <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl mb-8 border border-gray-800 bg-gray-900 flex items-center justify-center">
                            {isVideoLoading && activeVideo?.videoUrl && !videoError && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                                    <span className="text-xs text-gray-400">Loading video...</span>
                                </div>
                            )}
                            {videoError && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10 p-4">
                                    <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                                    <p className="text-sm text-red-400 text-center mb-2">{videoError}</p>
                                </div>
                            )}

                            {isYouTube(activeVideo?.videoUrl) ? (
                                <iframe 
                                    key={activeVideo?.videoUrl} 
                                    className="absolute inset-0 w-full h-full" 
                                    src={formatVideoUrl(activeVideo?.videoUrl)} 
                                    title={activeVideo?.title} 
                                    onLoad={handleVideoLoaded}
                                    allowFullScreen
                                ></iframe>
                            ) : activeVideo?.videoUrl ? (
                                <video 
                                    ref={videoRef}
                                    key={activeVideo?.videoUrl}
                                    controls 
                                    autoPlay
                                    onLoadedData={handleVideoLoaded}
                                    onCanPlay={handleVideoLoaded}
                                    onError={handleVideoError}
                                    className="w-full h-full"
                                    controlsList="nodownload"
                                    crossOrigin="anonymous"
                                >
                                    <source src={getFullVideoUrl(activeVideo.videoUrl)} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <PlayCircle className="w-12 h-12 mb-2 opacity-20" />
                                    <span className="text-sm">Select a lesson to start learning</span>
                                </div>
                            )}
                        </div>

                        {/* STUDY NOTES */}
                        <div className="bg-gray-800/60 rounded-3xl p-6 border border-gray-700 shadow-2xl backdrop-blur-sm max-w-5xl mx-auto">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 font-bold text-gray-100">
                                    <PencilLine className="w-5 h-5 text-indigo-400" /> Study Notes
                                </div>
                                <div className="flex items-center gap-3">
                                    {isSaving && <span className="text-[10px] text-indigo-400 animate-pulse">Auto-saving...</span>}
                                    <button onClick={downloadNotes} className="flex items-center gap-1.5 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-all font-semibold shadow-md">
                                        <Download className="w-3 h-3" /> Export .txt
                                    </button>
                                </div>
                            </div>
                            <textarea 
                                value={note} 
                                onChange={(e) => handleSaveNote(e.target.value)} 
                                className="w-full h-40 bg-gray-900/80 border border-gray-700 rounded-2xl p-5 text-sm outline-none focus:border-indigo-500 transition-all resize-none shadow-inner text-gray-300 leading-relaxed" 
                                placeholder="Start typing your study notes here..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;

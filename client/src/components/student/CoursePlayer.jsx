import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, PlayCircle, PencilLine, 
    Search, Send, Sparkles, 
    Download, LayoutList, PanelLeftClose, PanelLeftOpen,
    Loader2, Clock, User, AlertCircle
} from 'lucide-react';

const CoursePlayer = () => {
    // 1. Backend Configuration
    const BASE_URL = "http://localhost:3000"; 

    const location = useLocation();
    const navigate = useNavigate();

    // 2. Data Extraction
    const initialCourse = location.state?.course || null;
    const [courseData, setCourseData] = useState(initialCourse);
    const chatEndRef = useRef(null);
    const videoRef = useRef(null);

    // 3. States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [videoError, setVideoError] = useState(null);
    const [activeVideo, setActiveVideo] = useState(null);
    const [note, setNote] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [googleSearch, setGoogleSearch] = useState("");
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([{ role: 'ai', text: "Ready to help you learn! Ask me anything." }]);

    // 4. Initial Lesson Selection Logic
    // If the passed course object doesn't include full lesson data, try fetching full course by id
    useEffect(() => {
        const loadFullCourseIfNeeded = async () => {
            if (!courseData) return;

            const hasLessons = Array.isArray(courseData.lessons) && courseData.lessons.length > 0;
            if (!hasLessons) {
                const id = courseData._id || courseData.id;
                if (!id) return;
                try {
                    const res = await fetch(`${BASE_URL}/api/course/${id}`);
                    if (!res.ok) throw new Error('Failed to fetch course');
                    const full = await res.json();
                    setCourseData(full);
                    return;
                } catch (err) {
                    console.error('Could not load full course data:', err);
                }
            }

            if (courseData?.lessons?.length > 0 && !activeVideo) {
                console.log("📚 Setting first lesson as active");
                console.log("First lesson:", courseData.lessons[0]);
                setActiveVideo(courseData.lessons[0]);
            }
        };

        loadFullCourseIfNeeded();
    }, [courseData, activeVideo]);

    // 5. Scroll Chat to Bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 6. Load Notes for Active Lesson & Reset Video State
    useEffect(() => {
        if (courseData && activeVideo) {
            console.log("📹 Active video changed:", activeVideo);
            setIsVideoLoading(true);
            setVideoError(null);

            const savedNotes = JSON.parse(localStorage.getItem("course_notes") || "{}");
            const noteKey = `${courseData._id || courseData.id}_${activeVideo._id || activeVideo.title}`;
            setNote(savedNotes[noteKey] || "");
        }
    }, [activeVideo, courseData]);

    /* ================= HANDLERS ================= */

    const formatVideoUrl = (url) => {
        if (!url) return "";
        if (url.includes("embed")) return url;
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    };

    const isYouTube = (url) => {
        if (!url) return false;
        return url.includes("youtube.com") || url.includes("youtu.be");
    };

    const handleSaveNote = (text) => {
        setNote(text);
        setIsSaving(true);
        const savedNotes = JSON.parse(localStorage.getItem("course_notes") || "{}");
        const noteKey = `${courseData?._id || courseData?.id}_${activeVideo?._id || activeVideo?.title}`;
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

    const handleVideoError = (e) => {
        console.error("❌ Video error:", e);
        console.error("Video source:", getFullVideoUrl(activeVideo?.videoUrl));
        setIsVideoLoading(false);
        setVideoError("Unable to load video. Please check the video URL or server configuration.");
    };

    const handleVideoLoaded = () => {
        console.log("✅ Video loaded successfully");
        setIsVideoLoading(false);
        setVideoError(null);
    };

    // Construct full video URL
    const getFullVideoUrl = (url) => {
        if (!url) {
            console.log("⚠️ No video URL provided");
            return "";
        }
        
        // If URL already starts with http, use as-is
        if (url.startsWith('http://') || url.startsWith('https://')) {
            console.log("📹 Using absolute URL:", url);
            return url;
        }
        
        // Otherwise, prepend BASE_URL
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        const fullUrl = `${BASE_URL}${cleanUrl}`;
        console.log("📹 Constructed video URL:", fullUrl);
        return fullUrl;
    };

    if (!courseData) return (
        <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white gap-4">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
            <p className="text-gray-400">Loading course data...</p>
        </div>
    );

    // Debug logging
    console.log("🎓 Course:", courseData?.title || courseData?.name);
    console.log("📚 Total lessons:", courseData?.lessons?.length);
    console.log("🎯 Active lesson:", activeVideo?.title);
    console.log("📹 Active video URL:", activeVideo?.videoUrl);

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white font-sans overflow-hidden">
            
            {/* --- TOP BAR --- */}
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

                <div className="hidden lg:flex items-center gap-3">
                    <div onSubmit={(e) => { e.preventDefault(); window.open(`https://www.google.com/search?q=${googleSearch}`, '_blank') }} className="flex items-center bg-gray-900 border border-gray-600 rounded-full px-4 py-1.5 focus-within:border-indigo-500 w-64 shadow-inner">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input type="text" placeholder="Search Google..." className="bg-transparent text-sm w-full outline-none" value={googleSearch} onChange={(e) => setGoogleSearch(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && window.open(`https://www.google.com/search?q=${googleSearch}`, '_blank')} />
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                
                {/* --- SIDEBAR --- */}
                <div className={`bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                    <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex items-center gap-2">
                        <LayoutList className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Course Content</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {courseData?.lessons?.map((lesson, index) => {
                            console.log(`Lesson ${index + 1}:`, lesson.title, "Video:", lesson.videoUrl);
                            return (
                                <button 
                                    key={lesson._id || index} 
                                    onClick={() => {
                                        console.log("🎬 Switching to lesson:", lesson);
                                        setActiveVideo(lesson);
                                    }}
                                    className={`w-full text-left p-4 border-b border-gray-700/30 transition-all ${activeVideo?._id === lesson._id ? 'bg-indigo-600/20 border-l-4 border-l-indigo-500' : 'hover:bg-gray-700/40'}`}
                                >
                                        <p className={`text-xs ${activeVideo?._id === lesson._id ? 'text-white font-bold' : 'text-gray-400'}`}>
                                            {index + 1}. {lesson.title || "Untitled Lesson"}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock size={10} className="text-gray-500" />
                                        <p className="text-[10px] text-gray-500">{lesson.duration || "Video"}</p>
                                    </div>
                                    {lesson.videoUrl && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <PlayCircle size={10} className="text-green-500" />
                                            <p className="text-[10px] text-green-500">Video available</p>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* --- MAIN PLAYER AREA --- */}
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
                                    <p className="text-xs text-gray-500 text-center break-all">
                                        Trying to load: {getFullVideoUrl(activeVideo?.videoUrl)}
                                    </p>
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

                        {/* VIDEO INFO BAR */}
                        <div className="mb-8 px-2">
                             <h2 className="text-2xl font-bold mb-2">{activeVideo?.title || "No lesson selected"}</h2>
                             <div className="flex items-center gap-4 text-gray-400 text-sm">
                                <span className="flex items-center gap-1"><User size={14}/> {courseData?.instructor || courseData?.instructorName || "Instructor"}</span>
                                <span className="flex items-center gap-1"><Clock size={14}/> {activeVideo?.duration || "N/A"}</span>
                             </div>
                        </div>

                        {/* STUDY NOTES BOX */}
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

                    {/* AI ASSISTANT SIDEBAR */}
                    <div className="w-full md:w-80 lg:w-96 bg-gray-800 border-l border-gray-700 flex flex-col shrink-0">
                        <div className="p-4 border-b border-gray-700 flex items-center gap-2 bg-gray-800/80">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                            <span className="font-bold text-sm">AI Study Assistant</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/30">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-4 bg-gray-800 border-t border-gray-700">
                            <div className="relative flex items-center">
                                <input 
                                    type="text" 
                                    value={chatInput} 
                                    onChange={(e) => setChatInput(e.target.value)} 
                                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit(e)}
                                    placeholder="Ask a question..." 
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm outline-none focus:border-indigo-500" 
                                />
                                <button 
                                    onClick={handleChatSubmit}
                                    type="button" 
                                    className="absolute right-2 p-2 text-indigo-400 hover:text-white transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;
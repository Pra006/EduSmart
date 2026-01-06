import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, PlayCircle, CheckCircle, PencilLine, 
    Search, Globe, MessageSquare, Send, Sparkles, 
    Download, LayoutList, PanelLeftClose, PanelLeftOpen 
} from 'lucide-react';

const CoursePlayer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Pulling the full course object from navigation state
    const { course } = location.state || {};
    const chatEndRef = useRef(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // DYNAMIC DATA: Get lessons from your DB schema
    // If no lessons exist, we create a fallback object to prevent crashes
    const chapters = course?.lessons?.length > 0 ? course.lessons : [{ _id: '1', title: "No Lessons Available", videoUrl: "" }];
    
    const [activeVideo, setActiveVideo] = useState(chapters[0]);
    const [note, setNote] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [googleSearch, setGoogleSearch] = useState("");
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([{ role: 'ai', text: "Ready to help you learn! Ask me anything." }]);

    // Helper to fix YouTube URLs for the iframe
    const formatVideoUrl = (url) => {
        if (!url) return "";
        if (url.includes("embed")) return url;
        // Converts https://www.youtube.com/watch?v=ID to https://www.youtube.com/embed/ID
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}`;
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // RESTORED STUDY NOTES LOGIC
    useEffect(() => {
        if (course && activeVideo) {
            const savedNotes = JSON.parse(localStorage.getItem("course_notes") || "{}");
            // Unique key combining Course ID and Lesson ID to keep notes separate
            const noteKey = `${course._id}_${activeVideo._id || activeVideo.title}`;
            setNote(savedNotes[noteKey] || "");
        }
    }, [activeVideo, course]);

    const handleSaveNote = (text) => {
        setNote(text);
        setIsSaving(true);
        const savedNotes = JSON.parse(localStorage.getItem("course_notes") || "{}");
        const noteKey = `${course._id}_${activeVideo._id || activeVideo.title}`;
        savedNotes[noteKey] = text;
        localStorage.setItem("course_notes", JSON.stringify(savedNotes));
        setTimeout(() => setIsSaving(false), 800);
    };

    const downloadNotes = () => {
        if (!note.trim()) return alert("Notes are empty!");
        const element = document.createElement("a");
        const fileContent = `Course: ${course?.title}\nLesson: ${activeVideo.title}\n\nNOTES:\n${note}`;
        const file = new Blob([fileContent], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${activeVideo.title}_Notes.txt`;
        document.body.appendChild(element);
        element.click();
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setMessages(prev => [...prev, { role: 'user', text: chatInput }]);
        setChatInput("");
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: `That's a great question about ${activeVideo.title}! I'm here to help.` }]);
        }, 800);
    };

    if (!course) return <div className="h-screen bg-gray-900 flex items-center justify-center text-white">No Course Data Found...</div>;

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
                            {isSidebarOpen ? "Close Lessons" : "Open Lessons"}
                        </span>
                    </button>

                    <h1 className="text-md font-bold hidden md:block border-l border-gray-700 pl-4 ml-2">{course.title}</h1>
                </div>

                <div className="hidden lg:flex items-center gap-3">
                    <form onSubmit={(e) => { e.preventDefault(); window.open(`https://www.google.com/search?q=${googleSearch}`, '_blank') }} className="flex items-center bg-gray-900 border border-gray-600 rounded-full px-4 py-1.5 focus-within:border-indigo-500 w-64 shadow-inner">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input type="text" placeholder="Search Google..." className="bg-transparent text-sm w-full outline-none" value={googleSearch} onChange={(e) => setGoogleSearch(e.target.value)} />
                    </form>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                
                {/* --- DYNAMIC LESSON LIST SIDEBAR --- */}
                <div className={`bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                    <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex items-center gap-2">
                        <LayoutList className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Course Content</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {chapters.map((ch, index) => (
                            <button 
                                key={ch._id || index} 
                                onClick={() => setActiveVideo(ch)}
                                className={`w-full text-left p-4 border-b border-gray-700/30 transition-all ${activeVideo?.title === ch.title ? 'bg-indigo-600/20 border-l-4 border-l-indigo-500' : 'hover:bg-gray-700/40'}`}
                            >
                                <p className={`text-xs ${activeVideo?.title === ch.title ? 'text-white font-bold' : 'text-gray-400'}`}>
                                    {index + 1}. {ch.title}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-1">{ch.duration || "Video"}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- MAIN PLAYER AREA --- */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-black">
                    <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl mb-8 border border-gray-800 bg-gray-900">
                            <iframe 
                                key={activeVideo?.title} 
                                className="absolute inset-0 w-full h-full" 
                                src={formatVideoUrl(activeVideo?.videoUrl || course?.videoUrl)} 
                                title={activeVideo?.title} 
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* RESTORED NOTES BOX */}
                        <div className="bg-gray-800/60 rounded-3xl p-6 border border-gray-700 shadow-2xl backdrop-blur-sm max-w-5xl mx-auto">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 font-bold text-gray-100">
                                    <PencilLine className="w-5 h-5 text-indigo-400" /> Study Notes
                                </div>
                                <div className="flex items-center gap-3">
                                    {isSaving && <span className="text-[10px] text-indigo-400 animate-pulse">Auto-saving...</span>}
                                    <button onClick={downloadNotes} className="flex items-center gap-1.5 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-all font-semibold shadow-md">
                                        <Download className="w-3 h-3" /> Save Note
                                    </button>
                                </div>
                            </div>
                            <textarea 
                                value={note} 
                                onChange={(e) => handleSaveNote(e.target.value)} 
                                className="w-full h-40 bg-gray-900/80 border border-gray-700 rounded-2xl p-5 text-sm outline-none focus:border-indigo-500 transition-all resize-none shadow-inner text-gray-300 leading-relaxed" 
                                placeholder="Write notes for this lesson..."
                            />
                        </div>
                    </div>

                    {/* AI ASSISTANT SIDEBAR */}
                    <div className="w-full md:w-80 lg:w-96 bg-gray-800 border-l border-gray-700 flex flex-col shrink-0">
                        <div className="p-4 border-b border-gray-700 flex items-center gap-2 bg-gray-800/80">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                            <span className="font-bold text-sm">AI Study Bot</span>
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

                        <form onSubmit={handleChatSubmit} className="p-4 bg-gray-800 border-t border-gray-700">
                            <div className="relative flex items-center">
                                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask AI..." className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm outline-none focus:border-indigo-500" />
                                <button type="submit" className="absolute right-2 p-2 text-indigo-400 hover:text-white transition-colors"><Send className="w-5 h-5" /></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;
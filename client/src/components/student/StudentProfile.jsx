import React, { useState, useRef } from 'react';
import { 
  User, Camera, Trash2, Save, Globe, Briefcase, 
  GraduationCap, Calendar, ChevronDown 
} from 'lucide-react';

const StudentProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    country: '',
    dob: '',
    jobType: 'Full-time',
    interests: []
  });

  const educationalFields = [
    "Programming", "Graphic Design", "Business", "Science", "Computer Science", 
    "Marketing", "Languages", "Arabic", "Soft Skills", "Mobile Development", 
    "Women and Beauty", "Photography", "Computer Software", "Career Development", 
    "Real Estate", "Kitchen and Cooking", "Medical", "Engineering", 
    "Mathematics", "Drawing", "Music", "Technology", "Accounting", 
    "Digital Marketing", "Artificial Intelligence", "Web Design", "Humanities", "Agriculture"
  ];

  // Image Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const deleteImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (field) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(field)
        ? prev.interests.filter(i => i !== field)
        : [...prev.interests, field]
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saving Student Data:", { ...formData, profileImage });
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Profile Picture */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Profile Photo</h3>
              
              <div className="relative inline-block">
                <div className="w-40 h-40 rounded-full border-4 border-indigo-50 overflow-hidden bg-slate-100 flex items-center justify-center mx-auto">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={64} className="text-slate-300" />
                  )}
                </div>
                
                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 bg-indigo-600 p-3 rounded-full text-white shadow-lg hover:bg-indigo-700 transition-all"
                >
                  <Camera size={20} />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Update Photo
                </button>
                {profileImage && (
                  <button 
                    type="button"
                    onClick={deleteImage}
                    className="text-sm font-semibold text-red-500 flex items-center justify-center gap-1 hover:text-red-600"
                  >
                    <Trash2 size={14} /> Remove Photo
                  </button>
                )}
              </div>
              <p className="mt-6 text-xs text-slate-400">Allowed JPG, GIF or PNG. Max size of 2MB</p>
            </div>
          </div>

          {/* RIGHT COLUMN: Information */}
          <div className="lg:col-span-8 space-y-6">
            
            
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <User size={20} className="text-indigo-500" /> Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input 
                    name="firstName" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                    placeholder="Enter your first name" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    placeholder="Enter your last name" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                    <Calendar size={14} /> Date of Birth
                  </label>
                  <input 
                    type="date" 
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                    <Globe size={14} /> Country
                  </label>
                  <input 
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    placeholder="United States" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                    <Briefcase size={14} /> Job Type
                  </label>
                  <select 
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Freelance</option>
                    <option>Student</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                <GraduationCap size={20} className="text-indigo-500" /> Educational Interests
              </h2>
              <p className="text-sm text-slate-500 mb-6">Select the fields you want to specialize in.</p>
              
              <div className="flex flex-wrap gap-2">
                {educationalFields.map((field) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => toggleInterest(field)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      formData.interests.includes(field)
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button 
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Save size={20} /> Save Changes
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
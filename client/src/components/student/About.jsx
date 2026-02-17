import React from 'react';
import { BookOpen, Award, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
    const navigate = useNavigate();
  const stats = [
    { label: 'Active Students', value: '10K+' },
    { label: 'Total Courses', value: '500+' },
    { label: 'Expert Instructors', value: '150+' },
    { label: 'Certifications Issued', value: '25K+' },
  ];

  return (
    <div className="bg-white min-h-screen">
    
      <section className="relative py-20 bg-indigo-400 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Empowering the Next Generation of <span className="text-white">Learners</span>
          </h1>
          <p className="text-lg text-slate-200 max-w-3xl mx-auto">
            Our platform is dedicated to providing world-class education accessible to everyone, 
            everywhere. We bridge the gap between industry experts and students.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-[-12px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-8 rounded-xl shadow-xl border border-slate-100">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We believe that education is the foundation of progress. Our LMS project started with 
              a simple goal: to create a seamless, interactive, and affordable environment for 
              skills development in the digital age.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Whether you are an instructor looking to share your knowledge or a student 
              chasing your dream career, we provide the tools to help you succeed.
            </p>
          </div>
          <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center border-2 border-dashed border-slate-300">
            <span className="text-slate-400 font-medium">Mission Illustration / Image</span>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Learn With Us?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BookOpen className="w-8 h-8 text-blue-500" />}
              title="Expert-Led Courses"
              desc="Learn from industry professionals who bring real-world experience into the digital classroom."
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-blue-500" />}
              title="Learn Anywhere"
              desc="Access your lessons on any device, at any time. Our platform is optimized for mobile and desktop."
            />
            <FeatureCard 
              icon={<Award className="w-8 h-8 text-blue-500" />}
              title="Verified Certificates"
              desc="Earn industry-recognized certificates that help you stand out in the job market."
            />
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-8">Ready to start your journey?</h2>
        <button onClick={() => navigate('/signup')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
          Join for Free
        </button>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-slate-900">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

export default AboutPage;
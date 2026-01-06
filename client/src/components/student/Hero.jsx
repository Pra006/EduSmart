import React from "react";
import heroImage from "../../assets/hero.jpg";


const Hero = () => {
  return (
    <section id="hero" className="relative overflow-hidden bg-linear-to-br from-indigo-100 via-blue-50 to-indigo-200 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid md:grid-cols-2 gap-10 items-center">
        {/* Left content */}
        <div className="text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Empowering Legal Minds Through{" "}
            <span className="text-indigo-600">Interactive Online Education</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl">
            Unlock your potential with expert-led courses designed to help you learn anytime, anywhere.
          </p>

          <div className="space-x-5">
            <button className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center">
              GetStarted <i className="ri-arrow-right-line "></i>
            </button>
            <button className="border border-blue-600 bg-clip-text text-blue-600 px-4 py-2 rounded-full hover:">
              <i className="ri-book-open-line mr-2"></i>
              Explore Courses
            </button>
          </div>
          <div className="flex flex-wrap border-t border-indigo-500 pt-6 justify-between">
            <div>
              <div className=" text-indigo-500 ">20K+</div>
              <p className="text-gray-600">Active Student</p>
            </div>
            <div>
              <div className=" text-indigo-500 ">500+</div>
              <p className="text-gray-600">Expert Instructor</p>
            </div>
            <div>
              <div className=" text-indigo-500 ">100+</div>
              <p className="text-gray-600">Premium Courses</p>
            </div>
          </div>
        </div>

        {/* Right content (Hero image) */}
        <div className="flex justify-center md:justify-end">
          <img
            src={heroImage}
            alt="Learning Illustration"
            className="w-full max-w-md rounded-2xl shadow-lg"
          />
        </div>
     
      </div>
    </section>
    
  );
};

export default Hero;

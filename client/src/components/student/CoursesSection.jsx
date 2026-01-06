import React, { useState } from "react";
import { Star, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  "Programming",
  "Business",
  "Design"
];

const courses = [
  {
    id: 1,
    title: "Introduction to Programming",
    instructor: "John Doe",
    category: "Programming",
    rating: 4.8,
    students: 2350,
    duration: "12 weeks",
    price: "$89",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=1080&q=80",
  },
  {
    id: 2,
    title: "Business Strategy Masterclass",
    instructor: "Michael Chen",
    category: "Business",
    rating: 4.7,
    students: 1985,
    duration: "8 weeks",
    price: "$79",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1080&q=80",
  },
  {
    id: 3,
    title: "UI/UX Design for Beginners",
    instructor: "Emma Watson",
    category: "Design",
    rating: 4.6,
    students: 3050,
    duration: "10 weeks",
    price: "$69",
    image: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  }
];

const CoursesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="courses" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Explore Popular Courses
          </h2>
          <p className="text-gray-600 mt-2">
            Learn from the top categories available in our LMS platform.
          </p>
        </div>

        {/* Courses Grid (Only 3 Cards) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/course/${course.id}`)}
            >
              <div className="h-48 overflow-hidden rounded-t-xl">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-semibold text-lg text-gray-900">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm">{course.instructor}</p>

                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {course.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </span>
                </div>

                <button className="w-full bg-indigo-600 text-white py-2 rounded-full font-medium hover:bg-indigo-700 transition">
                  Enroll Now - {course.price}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/course-list")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            Show More Courses
          </button>
        </div>

      </div>
    </section>
  );
};

export default CoursesSection;

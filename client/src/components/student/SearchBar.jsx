import React, { useState } from 'react';
import { coursesData } from '../../assets/assets.js'
import CourseCard from './CourseCard';

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);

    const handleSearch = () => {
        const results = coursesData.filter((course) =>
            course.title.toLowerCase().includes(query.toLowerCase()) ||
            course.category.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCourses(results);
    };

    return (
        <div className="w-full mt-2 px-4 sm:px-6 lg:px-0">
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                    
                    {/* Input */}
                    <input
                        type="text"
                        placeholder="search for courses"
                        className="w-full sm:flex-1 min-w-0 px-5 py-3 sm:py-2.5 border border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors duration-200 text-base"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 sm:py-2.5 rounded-lg sm:rounded-full transition-all duration-300 whitespace-nowrap"
                    >
                        Search
                    </button>
                </div>

                {/* Display Results */}
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <CourseCard key={course.id} {...course} />
                        ))
                    ) : query !== "" ? (
                        <p className="text-red-500 font-medium mt-3">No courses found</p>
                    ) : null}
                </div>

            </div>
        </div>
    );
};

export default SearchBar;

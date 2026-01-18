import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ManageStudents = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) {
      const fetchEducatorCourses = async () => {
        try {
          setLoading(true);
          const res = await axios.get("http://localhost:3000/api/course/all");
          setCourses(res.data || []);
        } catch (err) {
          setError("Failed to load courses");
        } finally {
          setLoading(false);
        }
      };
      fetchEducatorCourses();
      return;
    }

    const fetchEnrolledStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/course/${courseId}/students`
        );
        setCourse(res.data.course);
        setStudents(res.data.students);
      } catch (err) {
        setError("Failed to load enrolled students");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledStudents();
  }, [courseId]);

  /* ---------- LOADING / ERROR ---------- */
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-600">
        Loading...
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 font-medium">{error}</p>
    );

  /* ---------- SELECT COURSE ---------- */
  if (!courseId) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Select a Course
        </h2>

        {courses.length === 0 ? (
          <p className="text-gray-500">No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() =>
                  navigate(`/educator/student/${course._id}`)
                }
                className="bg-white rounded-2xl p-6 cursor-pointer border border-gray-100
                           shadow-sm hover:shadow-xl hover:-translate-y-1
                           transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {course.category}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ---------- MANAGE STUDENTS ---------- */
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage Students
        </h2>
        <p className="text-gray-500 mt-1">
          Course: <span className="font-medium">{course?.title}</span>
        </p>
      </div>

      {students.length === 0 ? (
        <p className="text-gray-500">No students enrolled yet.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">#</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Email
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Course Name
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Enrolled At
                </th>
              </tr>
            </thead>

            <tbody>
              {students.map((enroll, index) => {
                const studentName = typeof enroll.studentId === 'object' 
                  ? enroll.studentId?.name || 'Unknown' 
                  : 'Unknown';
                const studentEmail = typeof enroll.studentId === 'object'
                  ? enroll.studentId?.email || 'N/A'
                  : 'N/A';

                return (
                  <tr
                    key={enroll._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">{index + 1}</td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {studentName}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {studentEmail}
                    </td>

                    <td className="px-6 py-4 text-indigo-600 font-semibold">
                      {course?.title}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(enroll.enrolledAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;

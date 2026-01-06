import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentEnrolled = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/enrollments/all`);
      if (res.data.success) {
        setEnrollments(res.data.enrollments);
      } else {
        setEnrollments([]);
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading enrolled students...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Enrolled Students</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Student Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No enrolled students found
                </td>
              </tr>
            ) : (
              enrollments.map((enroll) => (
                <tr key={enroll._id} className="border-t">
                  <td className="p-3">{enroll.studentName}</td>
                  <td className="p-3">{enroll.email}</td>
                  <td className="p-3">{enroll.courseName}</td>
                  <td className="p-3">${enroll.amountPaid}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-700">
                      {enroll.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(enroll.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentEnrolled;

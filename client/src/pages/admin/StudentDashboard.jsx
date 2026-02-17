import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, BookOpen, TrendingUp } from "lucide-react";
import StatCard from "../../components/admin/StatCard";

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/enrollment/all");
        setEnrollments(res.data.enrollments || []);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const totalEnrollments = enrollments.length;

  const totalStudents = new Set(
    enrollments.map((e) => e.studentId?._id).filter(Boolean),
  ).size;

  const totalRevenue = enrollments
    .filter((e) => e.status === "completed")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8 p-4 lg:p-8 bg-gray-50 dark:bg-black min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={<Users className="w-6 h-6 text-blue-500" />}
        />
        <StatCard
          title="Total Enrollments"
          value={totalEnrollments}
          icon={<BookOpen className="w-6 h-6 text-orange-500" />}
        />
        <StatCard
          title="Total Revenue"
          value={`$${Number(totalRevenue).toFixed(2)}`}
          icon={<TrendingUp className="w-6 h-6 text-green-500" />}
        />
      </div>

      {/* 🔥 Enrollment Table */}
      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Enrollments
          </h2>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-6 text-center">Loading enrollments...</p>
          ) : enrollments.length === 0 ? (
            <p className="p-6 text-center">No enrollments found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:text-white dark:bg-gray-800">
                  <th className="py-4 px-6 text-xs uppercase">Student Name</th>
                  <th className="py-4 px-6 text-xs uppercase">Email</th>
                  <th className="py-4 px-6 text-xs uppercase">
                    Course Enrolled
                  </th>
                  <th className="py-4 px-6 text-xs uppercase">Payment</th>
                  <th className="py-4 px-6 text-xs uppercase">
                    Enrollment Date
                  </th>
                  <th className="py-4 px-6 text-xs uppercase text-right">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {enrollments.map((enrollment) => (
                  <tr
                    key={enrollment._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="py-4 px-6 font-semibold text-gray-500 dark:text-gray-300">
                      {enrollment.studentId?.fullname || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-300">
                      {enrollment.studentId?.email || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-300">
                      {enrollment.courseId?.title || "N/A"}
                    </td>
                    <td className="py-4 px-6 font-mono text-sm text-gray-700 dark:text-gray-300">
                      $
                      {Number.isFinite(Number(enrollment.amount))
                        ? Number(enrollment.amount).toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-300">
                      {enrollment.enrolledAt
                        ? new Date(enrollment.enrolledAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          enrollment.status === "completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : enrollment.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {enrollment.status || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

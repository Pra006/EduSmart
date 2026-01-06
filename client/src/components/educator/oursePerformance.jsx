import React from 'react'
import { TrendingUp, Award, Target } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const oursePerformance = () => {
  const completionData = [
    { course: "Web Dev", completion: 78 },
    { course: "React", completion: 85 },
    { course: "DSA", completion: 72 },
    { course: "Mobile", completion: 68 },
    { course: "UX/UI", completion: 82 },
    { course: "Python", completion: 75 },
  ];

  const engagementData = [
    { week: "Week 1", engagement: 85, submissions: 78 },
    { week: "Week 2", engagement: 88, submissions: 82 },
    { week: "Week 3", engagement: 82, submissions: 75 },
    { week: "Week 4", engagement: 90, submissions: 87 },
    { week: "Week 5", engagement: 87, submissions: 84 },
    { week: "Week 6", engagement: 92, submissions: 89 },
  ];
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-gray-900 font-semibold text-xl">Course Performance Metrics</h3>
        <p className="text-gray-600">
          Track completion rates, grades, and engagement levels
        </p>
      </div>

      {/* Summary Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* Completion Rate Card */}
        <div>
          <div className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Completion Rate</p>
                <p className="text-2xl text-gray-900 font-semibold">76.7%</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +4.2% from last month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Card */}
        <div>
          <div className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Grade</p>
                <p className="text-2xl text-gray-900 font-semibold">84.3%</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +2.1% from last month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Card */}
        <div>
          <div className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Engagement</p>
                <p className="text-2xl text-gray-900 font-semibold">87.3%</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +5.8% from last month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar Chart */}
        <div className='mt-3'>
          <div>
            <h1 className='font-semibold text-gray-900 text-xl'>Course Completion Rates</h1>
            <p className='text-gray-600'>
              Percentage of students who completed each course
            </p>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completion" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div>
          <div className='mb-3'>
            <h1 className='font-semibold text-xl text-gray-900'>Engagement & Submissions Trend</h1>
            <p className='text-gray-600'>
              Weekly engagement and submission rates
            </p>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="engagement" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="submissions" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default oursePerformance
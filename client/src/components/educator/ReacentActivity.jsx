import React from 'react'
import { LogIn, FileText, MessageCircle, Clock, CircleDivide } from 'lucide-react';
const ReacentActivity = () => {
const activities = [
  {
    id: 1,
    type: 'login',
    student: 'Sarah Johnson',
    course: 'Web Development',
    action: 'logged in',
    time: '5 minutes ago',
    icon: LogIn,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 2,
    type: 'submission',
    student: 'Michael Chen',
    course: 'React Patterns',
    action: 'submitted Assignment 5',
    time: '12 minutes ago',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 3,
    type: 'question',
    student: 'Emily Rodriguez',
    course: 'Data Structures',
    action: 'asked a question',
    time: '25 minutes ago',
    icon: MessageCircle,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 4,
    type: 'submission',
    student: 'David Kim',
    course: 'Mobile Development',
    action: 'submitted Project 2',
    time: '1 hour ago',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 5,
    type: 'login',
    student: 'Jessica Thompson',
    course: 'UX/UI Design',
    action: 'logged in',
    time: '1 hour ago',
    icon: LogIn,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 6,
    type: 'submission',
    student: 'Alex Martinez',
    course: 'Python for Data Science',
    action: 'submitted Lab 8',
    time: '2 hours ago',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 7,
    type: 'question',
    student: 'Rachel Brown',
    course: 'Web Development',
    action: 'asked a question',
    time: '3 hours ago',
    icon: MessageCircle,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 8,
    type: 'login',
    student: 'James Wilson',
    course: 'React Patterns',
    action: 'logged in',
    time: '4 hours ago',
    icon: LogIn,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
];

  return (
   <div>
      <h1>
        <div className="flex items-center justify-between">
          <div>
            <h1 className='text-gray-900 font-semibold text-xl'>Recent Student Activity</h1>
            <p className='text-gray-600'>
              Monitor recent logins, submissions, and interactions
            </p>
          </div>
          <div variant="outline" className="gap-1">
            <Clock className="size-3" />
            Live
          </div>
        </div>
      </h1>
      <div className="mt-4">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0"
              >
                <div className={`${activity.bgColor} p-2 rounded-lg shrink-0`}>
                  <Icon className={`size-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span>{activity.student}</span>
                        <span className="text-gray-600"> {activity.action}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.course}</p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default ReacentActivity
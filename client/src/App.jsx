import React from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'
import { AuthProvider } from './Auth/AuthContext.jsx'
import Home from './pages/student/Home.jsx'
import CoursesList from './pages/student/CoursesList.jsx'
import CourseDetails from './pages/student/CourseDetails.jsx'
import MyEnrollments from './pages/student/MyEnrollments.jsx'
import Player from './pages/student/Player.jsx'
import Loading from './components/student/Loading.jsx'
import Educator from './pages/educator/Educator.jsx'
import Dashboard from './pages/educator/Dashboard.jsx'
import AddCourse from './pages/educator/AddCourse.jsx'
import MyCourses from './pages/educator/MyCourses.jsx'
import StudentEnrolled from './pages/educator/StudentEnrolled.jsx'
import Navbar from './components/student/Navbar.jsx'
import Login from './Auth/login.jsx'
import Signup from './Auth/Signup.jsx'
import 'remixicon/fonts/remixicon.css'
import CheckoutProcess from './components/student/CheckoutProcess.jsx'
// stripe Imports
import{Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import PaymentSuccess from './components/student/paymentSuccess.jsx';
import MyCourse from './components/student/myCourse.jsx';
import CoursePlayer from './components/student/CoursePlayer.jsx';
import NewCourse from './components/educator/NewCourse.jsx';
import Courses from './components/educator/Courses.jsx'

import Admin from './pages/admin/Admin.jsx'
    
// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const App = () => {
  const isEducatorRoute = useMatch('/educator/*');
 
  return (
    <AuthProvider>
      <div className='text-default min-h-screen bg-white'>
        {
          !isEducatorRoute && <Navbar />
        }
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/course-list' element={<CoursesList />} />
          <Route path='/course-list/:input' element={<CoursesList />} />
          <Route path='/course/:id' element={<CourseDetails />} />
          <Route path='/my-enrollments' element={<MyEnrollments />} />
          <Route path='/player/:courseId' element={<Player />} />
          <Route path='/loading/:path' element={<Loading />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path="/checkoutprocess" element={<Elements stripe={stripePromise}><CheckoutProcess /></Elements>}/>
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/my-courses" element={<MyCourse />} />
          <Route path="/course-player"element={<CoursePlayer />} />
         
          <Route path='/educator'element={<Educator />}>
            <Route path='educator' element={<Dashboard />} />
            <Route path='add-course' element={<AddCourse />} />
            <Route path='my-courses' element={<MyCourses />} />
            <Route path='student-enrolled' element={<StudentEnrolled />} />
            <Route path='new-course' element={<NewCourse />} />
            <Route path='courses' element={<Courses />}/>
          </Route>

          <Route path='/admin' element={<Admin/>}>

          </Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
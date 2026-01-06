import React from 'react'
import Navbar from '../../components/student/Navbar.jsx'
import Hero from '../../components/student/Hero.jsx'
import Companies from  "../../components/student/Companies.jsx"
import Footer from '../../components/student/Footer.jsx'
import CoursesSection from '../../components/student/CoursesSection.jsx'
import TestimonialsSection from '../../components/student/TestimonialsSection.jsx'
// import WhyChooseUs from '../../components/student/WhyChooseUs.jsx'

const Home = () => {
  return (
    <div className='flex flex-col justify-between space-y-7 text-center'>
       {<Hero/>}
       <Companies/>
       {<CoursesSection/>}
       {<TestimonialsSection/>}
       {<Footer/>}
       {/* {<WhyChooseUs/>} */}
    </div>
  )
}

export default Home
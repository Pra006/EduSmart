import React from 'react'
import { assets, testimonialsData } from '../../assets/assets.js'
import { motion } from 'framer-motion'

const TestimonialsSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className='container mx-auto py-10 lg:px-32 w-full overflow-hidden'
      id='Testimonials'
    >
      <h1 className='text-2xl sm:text-4xl font-bold mb-2 text-center'>
        What Our <span className='underline underline-offset-5 decoration-1 font-light'> Students Say</span>
      </h1>
      <p className='text-center mb-12 max-w-80 mx-auto text-gray-500 font-light'>
        Don't just take our word for it. Here's what our students have to say about their learning experience.
      </p>

      <div className="flex flex-wrap justify-center gap-8">
        {testimonialsData.map((testimonial, index) => (
          <div
            key={index}
            className='max-w-[340px] border shadow-lg rounded-lg px-8 py-12 text-center hover:shadow-xl transition'
          >
            <img
              className='w-20 h-20 mx-auto mb-4 rounded-full border'
              src={testimonial.image}
              alt={testimonial.alt}
            />
            <h2 className='text-xl font-medium text-gray-800 mb-2'>{testimonial.name}</h2>
            <p className='text-gray-600 text-sm mb-3'>{testimonial.title}</p>

            <div className='flex justify-center gap-1 mb-4 text-red-500'>
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <img key={i} src={assets.star_icon} alt="star" className='w-5 h-5' />
              ))}
            </div>

            <p className='text-gray-700 text-sm leading-relaxed'>{testimonial.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default TestimonialsSection

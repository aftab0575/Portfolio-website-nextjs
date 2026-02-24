'use client'

import { memo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import StackedCarousel from '@/components/ui/stacked-carousel'
import { portfolioData } from '@/constants/portfolioData'

const TestimonialsSection = memo(function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(sectionRef, { margin: '-100px', amount: 0.2 })

  const handleTestimonialClick = (testimonial: (typeof portfolioData.testimonials)[number]) => {
    console.log('Testimonial clicked:', testimonial.title)
    // Add custom logic here (e.g., open detailed testimonial modal)
  }

  return (
    <section id="testimonials" ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Testimonials from satisfied clients who trusted me with their projects
          </p>
        </motion.div>

        <StackedCarousel
          items={portfolioData.testimonials}
          autoPlay={isInView}
          autoPlayInterval={10000}
          onItemClick={handleTestimonialClick}
          className="mb-8"
        />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Real feedback from real clients • Auto-play pauses when out of view
          </p>
        </div>
      </div>
    </section>
  )
})

export default TestimonialsSection


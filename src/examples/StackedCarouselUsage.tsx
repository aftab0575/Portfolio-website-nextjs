'use client'

import { useState } from 'react'
import StackedCarousel, { CarouselItem } from '@/components/ui/stacked-carousel'
import { Button } from '@/components/ui/button'

// Example: How to integrate the stacked carousel into your homepage
export default function StackedCarouselUsage() {
  const [selectedCategory, setSelectedCategory] = useState<'skills' | 'projects'>('skills')

  // Skills data
  const skillsData: CarouselItem[] = [
    {
      id: 'react',
      title: 'React & Next.js',
      subtitle: 'Frontend Framework Expertise',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
      description: 'Building modern, performant web applications with React ecosystem'
    },
    {
      id: 'typescript',
      title: 'TypeScript',
      subtitle: 'Type-Safe Development',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop',
      description: 'Writing maintainable, scalable code with static type checking'
    },
    {
      id: 'nodejs',
      title: 'Node.js & APIs',
      subtitle: 'Backend Development',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
      description: 'Creating robust server-side applications and RESTful APIs'
    }
  ]

  // Projects data
  const projectsData: CarouselItem[] = [
    {
      id: 'portfolio',
      title: 'Portfolio Website',
      subtitle: 'Next.js • TypeScript • Tailwind',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      description: 'Modern portfolio with admin panel and responsive design'
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce Platform',
      subtitle: 'React • Node.js • MongoDB',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      description: 'Full-featured online store with payment integration'
    }
  ]

  const currentData = selectedCategory === 'skills' ? skillsData : projectsData

  const handleItemClick = (item: CarouselItem) => {
    console.log(`${selectedCategory} clicked:`, item.title)
    // Add your navigation logic here
    // For example: router.push(`/${selectedCategory}/${item.id}`)
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {selectedCategory === 'skills' ? 'My Skills' : 'Featured Projects'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {selectedCategory === 'skills' 
              ? 'Technologies and frameworks I work with'
              : 'Recent projects showcasing my development skills'
            }
          </p>
          
          {/* Category Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={selectedCategory === 'skills' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('skills')}
            >
              Skills
            </Button>
            <Button
              variant={selectedCategory === 'projects' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('projects')}
            >
              Projects
            </Button>
          </div>
        </div>

        {/* Stacked Carousel */}
        <StackedCarousel
          items={currentData}
          autoPlay={true}
          autoPlayInterval={4000}
          onItemClick={handleItemClick}
          className="mb-8"
        />

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" variant="outline">
            {selectedCategory === 'skills' ? 'View All Skills' : 'View All Projects'}
          </Button>
        </div>
      </div>
    </section>
  )
}

// Example: Simple skills-only carousel for homepage
export function SimpleSkillsCarousel() {
  const skills: CarouselItem[] = [
    {
      id: 'frontend',
      title: 'Frontend',
      subtitle: 'React • Next.js • TypeScript',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop'
    },
    {
      id: 'backend',
      title: 'Backend',
      subtitle: 'Node.js • Python • APIs',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop'
    },
    {
      id: 'database',
      title: 'Database',
      subtitle: 'MongoDB • PostgreSQL • Redis',
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop'
    }
  ]

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Technical Expertise</h2>
        <p className="text-muted-foreground">Core technologies I specialize in</p>
      </div>
      
      <StackedCarousel
        items={skills}
        autoPlay={true}
        autoPlayInterval={3000}
      />
    </div>
  )
}

// Example: Testimonials carousel
export function TestimonialsCarousel() {
  const testimonials: CarouselItem[] = [
    {
      id: 'testimonial1',
      title: 'Sarah Johnson',
      subtitle: 'CEO, TechStart Inc.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      description: '"Exceptional developer with great attention to detail. Delivered our project on time and exceeded expectations."'
    },
    {
      id: 'testimonial2',
      title: 'Michael Chen',
      subtitle: 'CTO, Digital Solutions',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      description: '"Professional, reliable, and technically excellent. The best developer we\'ve worked with."'
    }
  ]

  return (
    <div className="py-16 bg-muted/20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What Clients Say</h2>
        <p className="text-muted-foreground">Testimonials from satisfied clients</p>
      </div>
      
      <StackedCarousel
        items={testimonials}
        autoPlay={true}
        autoPlayInterval={5000}
      />
    </div>
  )
}
'use client'

import { memo } from 'react'
import StackedCarousel, { CarouselItem } from '@/components/ui/stacked-carousel'

// Sample skills data - replace with your actual data
const skillsData: CarouselItem[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    subtitle: 'Modern UI/UX with React & Next.js',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&crop=center',
    description: 'Building responsive, accessible, and performant user interfaces with React, Next.js, TypeScript, and Tailwind CSS.'
  },
  {
    id: 'backend',
    title: 'Backend Development',
    subtitle: 'Scalable APIs & Server Architecture',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center',
    description: 'Creating robust server-side applications with Node.js, Express, Python, and cloud-native architectures.'
  },
  {
    id: 'database',
    title: 'Database Design',
    subtitle: 'Data Modeling & Optimization',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop&crop=center',
    description: 'Designing efficient database schemas with MongoDB, PostgreSQL, and implementing caching strategies.'
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud',
    subtitle: 'CI/CD & Infrastructure as Code',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center',
    description: 'Automating deployments with Docker, AWS, GitHub Actions, and monitoring production systems.'
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    subtitle: 'Cross-Platform Apps',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center',
    description: 'Building native and cross-platform mobile applications with React Native and Flutter.'
  },
  {
    id: 'ai',
    title: 'AI & Machine Learning',
    subtitle: 'Intelligent Solutions',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=center',
    description: 'Integrating AI capabilities with OpenAI API, LangChain, and building intelligent web applications.'
  }
]

interface SkillsCarouselProps {
  className?: string
  autoPlay?: boolean
}

const SkillsCarousel = memo(function SkillsCarousel({ 
  className,
  autoPlay = true 
}: SkillsCarouselProps) {
  const handleSkillClick = (skill: CarouselItem) => {
    console.log('Skill clicked:', skill.title)
    // Add your custom logic here (e.g., navigate to detailed view, open modal, etc.)
  }

  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Skills & Technologies
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my technical expertise across different domains of software development
          </p>
        </div>
        
        <StackedCarousel
          items={skillsData}
          autoPlay={autoPlay}
          autoPlayInterval={4000}
          onItemClick={handleSkillClick}
          className="mb-8"
        />
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Click on cards to explore • Use arrow keys to navigate
          </p>
        </div>
      </div>
    </section>
  )
})

export default SkillsCarousel
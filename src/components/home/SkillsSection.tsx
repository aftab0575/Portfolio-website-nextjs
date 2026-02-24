'use client'

import { useState, memo, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import StackedCarousel from '@/components/ui/stacked-carousel'
import { motion, useInView } from 'framer-motion'
import { routes } from '@/constants/routes'
import { portfolioData } from '@/constants/portfolioData'
import { Code, Server, Database, Cloud, Brain, ExternalLink } from 'lucide-react'

const SkillsSection = memo(function SkillsSection() {
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel')
  const sectionRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(sectionRef, { margin: '-100px', amount: 0.2 })

  const skillCategories = [
    { title: 'Frontend', icon: Code, skills: portfolioData.skills.frontend },
    { title: 'Backend', icon: Server, skills: portfolioData.skills.backend },
    { title: 'Database', icon: Database, skills: portfolioData.skills.database },
    { title: 'DevOps', icon: Cloud, skills: portfolioData.skills.devops },
    { title: 'AI/ML', icon: Brain, skills: portfolioData.skills.ai },
  ]

  const handleSkillClick = (skill: (typeof portfolioData.skills.carouselData)[number]) => {
    console.log('Skill clicked:', skill.title)
    // Add navigation logic here, e.g., router.push(`/skills/${skill.id}`)
  }

  return (
    <section id="skills" ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Skills & Technologies</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore my technical expertise across different domains of software development
          </p>

          {/* View Mode Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={viewMode === 'carousel' ? 'default' : 'outline'}
              onClick={() => setViewMode('carousel')}
              size="sm"
            >
              Interactive View
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              size="sm"
            >
              Grid View
            </Button>
          </div>
        </motion.div>

        {viewMode === 'carousel' ? (
          <>
            {/* Stacked Carousel */}
            <StackedCarousel
              items={portfolioData.skills.carouselData}
              autoPlay={isInView}
              autoPlayInterval={6000}
              onItemClick={handleSkillClick}
              className="mb-8"
            />

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Click cards to explore • Auto-play pauses when out of view
              </p>
              <Link href={routes.sections.projects}>
                <Button variant="outline">
                  See Projects
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          /* Traditional Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {skillCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <category.icon className="w-6 h-6 text-primary mr-3" />
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                  </div>
                  <div className="space-y-2">
                    {category.skills.map((skill, skillIndex) => (
                      <div
                        key={skillIndex}
                        className="text-sm text-muted-foreground bg-background px-3 py-1 rounded-full"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
})

export default SkillsSection


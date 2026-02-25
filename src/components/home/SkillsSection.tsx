'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { routes } from '@/constants/routes'
import { portfolioData } from '@/constants/portfolioData'
import { Code, Server, Database, Cloud, Brain, ExternalLink } from 'lucide-react'

const SkillsSection = memo(function SkillsSection() {
  const skillCategories = [
    { title: 'Frontend', icon: Code, skills: portfolioData.skills.frontend },
    { title: 'Backend', icon: Server, skills: portfolioData.skills.backend },
    { title: 'Database', icon: Database, skills: portfolioData.skills.database },
    { title: 'DevOps', icon: Cloud, skills: portfolioData.skills.devops },
    { title: 'AI/ML', icon: Brain, skills: portfolioData.skills.ai },
  ]

  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Skills & Technologies</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my technical expertise across different domains of software development
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
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

        <div className="text-center">
          <Link href={routes.sections.projects}>
            <Button variant="outline">
              See Projects
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
})

export default SkillsSection


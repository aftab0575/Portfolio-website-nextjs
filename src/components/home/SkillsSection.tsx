'use client'

import { type ForwardRefExoticComponent, type ReactNode, type RefAttributes, memo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import CardSwap, { Card } from '@/components/CardSwap'

type CardPropsWithChildren = { children?: ReactNode; customClass?: string; className?: string }
const TypedCard = Card as ForwardRefExoticComponent<CardPropsWithChildren & RefAttributes<HTMLDivElement>>
import { routes } from '@/constants/routes'
import { portfolioData } from '@/constants/portfolioData'
import { Code, Server, Database, Cloud, Brain, ExternalLink } from 'lucide-react'

const skillCategories = [
  { title: 'Frontend', icon: Code, skills: portfolioData.skills.frontend },
  { title: 'Backend', icon: Server, skills: portfolioData.skills.backend },
  { title: 'Database', icon: Database, skills: portfolioData.skills.database },
  { title: 'DevOps', icon: Cloud, skills: portfolioData.skills.devops },
  { title: 'AI/ML', icon: Brain, skills: portfolioData.skills.ai },
]

const SkillsSection = memo(function SkillsSection() {
  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Skills & Technologies</h2>
        </motion.div>

        <div className="skills-single-container flex flex-col lg:flex-row items-stretch rounded-2xl overflow-hidden bg-card border border-border shadow-xl mb-10 min-h-[320px] sm:min-h-[380px] md:min-h-[420px]">
          <div className="flex flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-14 lg:min-w-[320px] lg:max-w-[420px]">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-3">
              Explore my technical expertise across different domains of software development
            </p>
            <p className="text-sm text-muted-foreground">Just look at it go!</p>
          </div>
          <div className="skills-card-swap-area relative flex-1 min-h-[320px] sm:min-h-[380px] md:min-h-[420px] overflow-hidden">
          <div className="skills-card-swap-wrapper absolute inset-0 overflow-hidden">
            <CardSwap
              sizeToFit
              cardDistance={60}
              verticalDistance={70}
              delay={5000}
              pauseOnHover
              dropDistance={240}
              onCardClick={() => {}}
            >
              {skillCategories.map((category, index) => (
                <TypedCard
                  key={index}
                  customClass="skills-swap-card rounded-2xl bg-card border border-border text-foreground shadow-lg overflow-hidden"
                >
                  <div className="p-4 sm:p-6 h-full flex flex-col overflow-auto">
                    <div className="flex items-center mb-4">
                      <category.icon className="w-6 h-6 text-primary mr-3 flex-shrink-0" />
                      <h3 className="text-lg font-bold">{category.title}</h3>
                    </div>
                    <div className="space-y-2 flex-1">
                      {category.skills.map((skill, skillIndex) => (
                        <div
                          key={skillIndex}
                          className="text-sm text-muted-foreground bg-background/80 px-3 py-1 rounded-full w-fit"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </TypedCard>
              ))}
            </CardSwap>
          </div>
          </div>
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


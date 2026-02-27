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
import StarBorder from '@/components/StarBorder'

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

        <div className="skills-single-container flex flex-col lg:flex-row items-stretch rounded-2xl overflow-hidden bg-card border border-border shadow-xl mb-10 min-h-[320px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[550px]">
          <div className="flex flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-14 lg:min-w-[320px] lg:max-w-[420px]">
            <div className="space-y-3 sm:space-y-4 max-w-md">
              <p className="text-xs font-semibold tracking-[0.2em] text-primary/70 uppercase">
                Skills overview
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-snug">
                Explore my technical expertise across different domains of software development
              </p>
              <p className="text-sm text-muted-foreground/90">
                Hover over the cards to stop the animation and see the skills in detail !!!
              </p>
            </div>
          </div>
          <div className="skills-card-swap-area relative flex-1 min-h-[320px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[480px] overflow-hidden">
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
                  <div className="skills-swap-card-inner p-4 sm:p-6 h-full flex flex-col overflow-auto">
                    <div className="flex items-center gap-3 mb-0.5">
                      <div className="skills-card-icon-wrap flex items-center justify-center rounded-lg bg-primary/10 text-primary p-1.5">
                        <category.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      </div>
                      <h3 className="text-base font-semibold text-foreground">{category.title}</h3>
                    </div>
                    <div className="skills-card-divider my-2" aria-hidden />
                    <div className="grid grid-cols-[30%_70%] gap-x-0.5 gap-y-2 flex-1 min-w-0 overflow-hidden content-start items-start">
                      {category.skills.map((skill, skillIndex) => (
                        <StarBorder
                          key={skillIndex}
                          as="span"
                          thickness={1}
                          color="hsl(var(--primary) / 0.6)"
                          speed="8s"
                          className="skills-skill-pill block w-fit max-w-[12rem] rounded-xl overflow-hidden"
                          contentClassName="skills-skill-pill-inner px-3 py-1.5 text-sm font-medium text-muted-foreground bg-muted/90 hover:bg-muted border-0 rounded-xl break-words transition-all duration-200"
                        >
                          {skill}
                        </StarBorder>
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


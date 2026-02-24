'use client'

import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { portfolioData } from '@/constants/portfolioData'

const AboutSection = memo(function AboutSection() {
  const [showFullBio, setShowFullBio] = useState(false)

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn more about my journey, values, and what drives me as a developer.
            </p>
          </motion.div>

          <div className="mb-10">
            <Card>
              <CardContent className="p-8">
                <div className="text-lg text-muted-foreground leading-relaxed">
                  <p className="mb-4">{portfolioData.about.short}</p>
                  {showFullBio && (
                    <>
                      <p className="mb-4">{portfolioData.about.fullBio}</p>
                      <p className="mb-4">{portfolioData.about.story}</p>
                      <p>{portfolioData.about.approach}</p>
                    </>
                  )}
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="text-primary hover:text-primary/80"
                  >
                    {showFullBio ? 'Read Less' : 'Read More'}
                    <ChevronRight
                      className={`w-4 h-4 ml-1 transition-transform ${
                        showFullBio ? 'rotate-90' : ''
                      }`}
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {portfolioData.about.stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Values */}
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8">My Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioData.about.values.map((value, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold mb-2">{value.title}</h4>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default AboutSection


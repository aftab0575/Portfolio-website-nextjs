'use client'

import { memo, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import Loader from '@/components/common/Loader'
import { Calendar } from 'lucide-react'
import { formatDateRange } from '@/utils/formatDate'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchExperiences, selectShouldFetchExperiences } from '@/store/slices/experienceSlice'

const ExperienceSection = memo(function ExperienceSection() {
  const dispatch = useAppDispatch()
  const { experiences, isLoading, error } = useAppSelector((state) => state.experience)
  const shouldFetch = useAppSelector(selectShouldFetchExperiences)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (shouldFetch && !hasFetched.current && !isLoading && !error) {
      hasFetched.current = true
      dispatch(fetchExperiences())
    }
  }, [dispatch, shouldFetch, isLoading, error])

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Experience</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My professional journey and key milestones
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No experience available yet.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

              {experiences.map((exp, index) => (
                <div
                  key={exp._id || `${exp.company}-${exp.role}-${exp.startDate}`}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-3 h-3 bg-primary rounded-full border-4 border-background z-10" />

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                    }`}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-2">
                          <Calendar className="w-4 h-4 text-primary mr-2" />
                          <span className="text-sm text-muted-foreground">
                            {formatDateRange(exp.startDate, exp.endDate)}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-1">{exp.role}</h3>
                        <p className="text-primary font-medium mb-3">{exp.company}</p>
                        {exp.description && (
                          <div className="text-muted-foreground mb-4">
                            {exp.description
                              .split('\n')
                              .filter((line) => line.trim().startsWith('-')).length > 0 ? (
                              <ul className="list-disc list-inside space-y-1">
                                {exp.description
                                  .split('\n')
                                  .filter((line) => line.trim().startsWith('-'))
                                  .map((line, idx) => (
                                    <li key={idx} className="pl-2">
                                      {line.trim().replace(/^-/, '').trim()}
                                    </li>
                                  ))}
                              </ul>
                            ) : (
                              <p>{exp.description}</p>
                            )}
                          </div>
                        )}
                        {exp.techStack?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {exp.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="px-3 py-1 text-sm bg-muted rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
})

export default ExperienceSection


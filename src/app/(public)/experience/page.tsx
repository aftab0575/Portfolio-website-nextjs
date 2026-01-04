'use client'

import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchExperiences } from '@/store/slices/experienceSlice'
import { formatDateRange } from '@/utils/formatDate'
import Loader from '@/components/common/Loader'

export default function ExperiencePage() {
  const dispatch = useAppDispatch()
  const { experiences, isLoading } = useAppSelector((state) => state.experience)

  useEffect(() => {
    // Fetch experiences if not already loaded
    if (experiences.length === 0 && !isLoading) {
      dispatch(fetchExperiences())
    }
  }, [dispatch, experiences.length, isLoading])

  return (
    <main className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-12 text-center">Work Experience</h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No experience available yet.</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                <div className="space-y-12">
                  {experiences.map((exp, index) => (
                  <div key={exp._id} className="relative pl-20">
                    <div className="absolute left-6 top-2 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-semibold">{exp.role}</h3>
                            <p className="text-lg text-gray-600">{exp.company}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDateRange(exp.startDate, exp.endDate)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{exp.description}</p>
                        {exp.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {exp.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="px-3 py-1 text-sm bg-gray-100 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
    </main>
  )
}


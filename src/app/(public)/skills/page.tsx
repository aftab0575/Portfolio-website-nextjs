'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchSkills } from '@/store/slices/skillsSlice'
import Loader from '@/components/common/Loader'

export default function SkillsPage() {
  const dispatch = useAppDispatch()
  const { skills, isLoading } = useAppSelector((state) => state.skills)

  useEffect(() => {
    // Fetch active skills if not already loaded
    if (skills.length === 0 && !isLoading) {
      dispatch(fetchSkills(true))
    }
  }, [dispatch, skills.length, isLoading])

  const activeSkills = skills.filter((s) => s.isActive)
  const categories = Array.from(new Set(activeSkills.map((s) => s.category)))

  return (
    <main className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-12 text-center">Skills & Technologies</h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No skills available yet.</p>
            </div>
          ) : (
            categories.map((category) => {
              const categorySkills = activeSkills.filter((s) => s.category === category)
            return (
              <Card key={category} className="mb-8">
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill._id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-gray-600">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-primary h-3 rounded-full transition-all"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })
          )}
        </div>
    </main>
  )
}


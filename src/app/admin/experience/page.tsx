'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchExperiences,
  deleteExperience,
  createExperience,
  updateExperience,
} from '@/store/slices/experienceSlice'
import {
  selectAllExperiences,
  selectExperiencesLoading,
  selectExperiencesError,
  selectShouldFetchExperiences,
} from '@/store/selectors'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { ExperienceFormData } from '@/types/experience'
import { useExperienceApiGuards } from '@/hooks/useApiGuards'

export default function ExperiencePage() {
  const dispatch = useAppDispatch()
  const experiences = useAppSelector(selectAllExperiences)
  const isLoading = useAppSelector(selectExperiencesLoading)
  const error = useAppSelector(selectExperiencesError)
  const shouldFetch = useAppSelector(selectShouldFetchExperiences)
  const hasFetched = useRef(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: '',
    role: '',
    startDate: '',
    endDate: null,
    description: '',
    techStack: [],
  })
  const [techInput, setTechInput] = useState('')
  
  // Use API guards to prevent cascading calls
  const experienceGuards = useExperienceApiGuards({ debug: true })

  useEffect(() => {
    // Check API guards before fetching
    const guardResult = experienceGuards.checkFetchExperiences()
    
    // Only fetch if guards allow it and we should fetch (no valid cache) and haven't fetched yet
    if (guardResult.allowed && shouldFetch && !hasFetched.current && !isLoading && !error) {
      hasFetched.current = true
      experienceGuards.registerApiCall('experience/fetchAll')
      dispatch(fetchExperiences())
    } else if (!guardResult.allowed) {
      console.log(`[Admin Experience] API call blocked: ${guardResult.reason}`)
      
      // If we have cached result, we can still show the UI
      if (guardResult.cachedResult) {
        console.log('[Admin Experience] Using cached result from API guards')
      }
    }
  }, []) // Empty dependency array prevents infinite loops

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await dispatch(updateExperience({ id: editingId, data: formData })).unwrap()
      } else {
        await dispatch(createExperience(formData)).unwrap()
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({
        company: '',
        role: '',
        startDate: '',
        endDate: null,
        description: '',
        techStack: [],
      })
    } catch (error: any) {
      alert(error || 'Failed to save experience')
    }
  }

  const handleEdit = (exp: any) => {
    setFormData(exp)
    setEditingId(exp._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await dispatch(deleteExperience(id)).unwrap()
    } catch (error) {
      alert('Failed to delete experience')
    }
  }

  const addTech = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()],
      })
      setTechInput('')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Experience</h1>
          <p className="mt-2 text-gray-600">Manage your work experience</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Cancel' : 'New Experience'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Experience' : 'New Experience'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date (leave empty if current)</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.endDate || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value || null })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tech Stack</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className="flex-1 px-3 py-2 border rounded-md"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    placeholder="Add technology"
                  />
                  <Button type="button" onClick={addTech}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            techStack: formData.techStack.filter((_, i) => i !== index),
                          })
                        }
                        className="ml-2 text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {experiences.map((exp) => (
          <Card key={exp._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{exp.role}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{exp.company}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(exp)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(exp._id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.techStack.map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs bg-gray-100 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


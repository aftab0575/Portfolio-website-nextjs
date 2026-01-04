'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { 
  fetchSkills, 
  deleteSkill, 
  createSkill, 
  updateSkill
} from '@/store/slices/skillsSlice'
import {
  selectAllSkills,
  selectSkillsLoading,
  selectSkillsError,
  selectShouldFetchSkills,
  selectSkillCategories
} from '@/store/selectors'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { SkillFormData } from '@/types/skill'
import apiClient from '@/services/apiClient'
import { useSkillsApiGuards } from '@/hooks/useApiGuards'

export default function SkillsPage() {
  const dispatch = useAppDispatch()
  const skills = useAppSelector(selectAllSkills)
  const isLoading = useAppSelector(selectSkillsLoading)
  const error = useAppSelector(selectSkillsError)
  const shouldFetch = useAppSelector(state => selectShouldFetchSkills(state, false)) // false = fetch all skills
  const categories = useAppSelector(selectSkillCategories)
  const hasFetched = useRef(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    category: '',
    level: 50,
    order: 0,
    isActive: true,
  })
  
  // Use API guards to prevent cascading calls
  const skillsGuards = useSkillsApiGuards({ debug: true })

  useEffect(() => {
    // Check API guards before fetching
    const guardResult = skillsGuards.checkFetchSkills(false) // false = fetch all skills
    
    // Only fetch if guards allow it and we should fetch (no valid cache) and haven't fetched yet
    if (guardResult.allowed && shouldFetch && !hasFetched.current && !isLoading && !error) {
      hasFetched.current = true
      skillsGuards.registerApiCall('skills/fetchAll', { activeOnly: false })
      dispatch(fetchSkills(false)) // false = fetch all skills, not just active ones
    } else if (!guardResult.allowed) {
      console.log(`[Admin Skills] API call blocked: ${guardResult.reason}`)
      
      // If we have cached result, we can still show the UI
      if (guardResult.cachedResult) {
        console.log('[Admin Skills] Using cached result from API guards')
      }
    }
  }, []) // Empty dependency array prevents infinite loops

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await dispatch(updateSkill({ id: editingId, data: formData })).unwrap()
      } else {
        await dispatch(createSkill(formData)).unwrap()
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', category: '', level: 50, order: 0, isActive: true })
    } catch (error: any) {
      alert(error || 'Failed to save skill')
    }
  }

  const handleEdit = (skill: any) => {
    setFormData(skill)
    setEditingId(skill._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await dispatch(deleteSkill(id)).unwrap()
    } catch (error) {
      alert('Failed to delete skill')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
          <p className="mt-2 text-gray-600">Manage your skills and proficiency levels</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Cancel' : 'New Skill'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Skill' : 'New Skill'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Level: {formData.level}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <label className="text-sm">Active</label>
              </div>
              <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {categories.map((category) => (
        <Card key={category} className="mb-6">
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {skills
                .filter((s) => s.category === category)
                .map((skill) => (
                  <div
                    key={skill._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-gray-600">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(skill)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(skill._id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


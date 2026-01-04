'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchThemes, fetchActiveTheme, activateTheme, createTheme } from '@/store/slices/themeSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, Check } from 'lucide-react'
import { Theme } from '@/types/theme'
import apiClient from '@/services/apiClient'

export default function ThemesPage() {
  const dispatch = useAppDispatch()
  const { themes, activeTheme, isLoading } = useAppSelector((state) => state.theme)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    variables: {
      primary: '#0D1B2A',
      secondary: '#2A9D8F',
      background: '#FFFFFF',
      foreground: '#1D3557',
      accent: '#E76F51',
      border: '#F1F3F5',
    },
  })

  useEffect(() => {
    // Only fetch if data is not already loaded
    if (themes.length === 0 && !isLoading) {
      dispatch(fetchThemes())
    }
    if (!activeTheme) {
      dispatch(fetchActiveTheme())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(createTheme(formData)).unwrap()
      setShowForm(false)
      setFormData({
        name: '',
        variables: {
          primary: '#0D1B2A',
          secondary: '#2A9D8F',
          background: '#FFFFFF',
          foreground: '#1D3557',
          accent: '#E76F51',
          border: '#F1F3F5',
        },
      })
    } catch (error: any) {
      alert(error || 'Failed to create theme')
    }
  }

  const handleActivate = async (id: string) => {
    try {
      await dispatch(activateTheme(id)).unwrap()
      dispatch(fetchActiveTheme())
    } catch (error) {
      alert('Failed to activate theme')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Themes</h1>
          <p className="mt-2 text-gray-600">Manage website themes</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Palette className="mr-2 h-4 w-4" />
          {showForm ? 'Cancel' : 'New Theme'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme Name</label>
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.variables).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-2 capitalize">
                      {key}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            variables: { ...formData.variables, [key]: e.target.value },
                          })
                        }
                        className="h-10 w-20 border rounded"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            variables: { ...formData.variables, [key]: e.target.value },
                          })
                        }
                        className="flex-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button type="submit">Create Theme</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Card
            key={theme._id}
            className={theme.isActive ? 'border-2 border-primary' : ''}
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{theme.name}</CardTitle>
                {theme.isActive && (
                  <span className="px-2 py-1 text-xs bg-primary text-white rounded">
                    Active
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="h-32 rounded-lg mb-4"
                style={{ backgroundColor: theme.variables.background }}
              >
                <div className="p-4 h-full flex flex-col justify-between">
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.variables.foreground }}
                  >
                    Sample Text
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="px-3 py-1 rounded text-xs"
                      style={{
                        backgroundColor: theme.variables.primary,
                        color: theme.variables.background,
                      }}
                    >
                      Primary
                    </div>
                    <div
                      className="px-3 py-1 rounded text-xs"
                      style={{
                        backgroundColor: theme.variables.accent,
                        color: theme.variables.background,
                      }}
                    >
                      Accent
                    </div>
                  </div>
                </div>
              </div>
              {!theme.isActive && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleActivate(theme._id!)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Activate
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


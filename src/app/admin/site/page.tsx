'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import HeroImageUpload from '@/modules/cloudinary/components/HeroImageUpload'
import apiClient from '@/services/apiClient'
import { Site } from '@/modules/site/types'

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [site, setSite] = useState<Site | null>(null)
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [heroImageAlt, setHeroImageAlt] = useState('Portrait artwork for hero section')
  const [heroPublicId, setHeroPublicId] = useState<string | undefined>()

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const res = await apiClient.get<Site>('/api/site')
        if (res.success && res.data) {
          setSite(res.data)
          setHeroImageUrl(res.data.hero?.imageUrl || '')
          setHeroImageAlt(res.data.hero?.imageAlt || 'Portrait artwork for hero section')
          setHeroPublicId(res.data.hero?.publicId)
        }
      } catch {
        setSite(null)
      } finally {
        setLoading(false)
      }
    }
    fetchSite()
  }, [])

  const handleHeroImageChange = (url: string, alt: string, publicId?: string) => {
    setHeroImageUrl(url)
    setHeroImageAlt(alt || 'Portrait artwork for hero section')
    setHeroPublicId(publicId)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await apiClient.put<Site>('/api/site', {
        hero: {
          imageUrl: heroImageUrl,
          imageAlt: heroImageAlt,
          publicId: heroPublicId,
        },
      })
      if (res.success) {
        alert('Site settings saved successfully')
        if (res.data) setSite(res.data)
      } else {
        throw new Error(res.error)
      }
    } catch (error: any) {
      alert(error?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-12 text-center">Loading...</div>
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Site Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <p className="text-sm text-gray-600">
            Upload and manage the hero portrait image shown on the home page.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Hero Portrait</label>
              <HeroImageUpload
                imageUrl={heroImageUrl}
                imageAlt={heroImageAlt}
                onChange={handleHeroImageChange}
              />
            </div>
            {heroImageUrl && (
              <div>
                <label className="mb-2 block text-sm font-medium">Image alt text</label>
                <Input
                  value={heroImageAlt}
                  onChange={(e) => setHeroImageAlt(e.target.value)}
                  placeholder="Portrait artwork for hero section"
                />
              </div>
            )}
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

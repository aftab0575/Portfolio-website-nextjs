'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import HeroImageUpload from '@/modules/cloudinary/components/HeroImageUpload'
import CvUpload from '@/modules/cloudinary/components/CvUpload'
import apiClient from '@/services/apiClient'
import { Site } from '@/modules/site/types'

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [site, setSite] = useState<Site | null>(null)
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [heroImageAlt, setHeroImageAlt] = useState('Portrait artwork for hero section')
  const [heroPublicId, setHeroPublicId] = useState<string | undefined>()
  const [aboutImageUrl, setAboutImageUrl] = useState('')
  const [aboutImageAlt, setAboutImageAlt] = useState('About section image')
  const [aboutPublicId, setAboutPublicId] = useState<string | undefined>()
  const [cvUrl, setCvUrl] = useState('')
  const [cvFileName, setCvFileName] = useState('CV')
  const [cvPublicId, setCvPublicId] = useState<string | undefined>()
  const [cvDirty, setCvDirty] = useState(false)

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const res = await apiClient.get<Site>('/api/site')
        if (res.success && res.data) {
          setSite(res.data)
          setHeroImageUrl(res.data.hero?.imageUrl || '')
          setHeroImageAlt(res.data.hero?.imageAlt || 'Portrait artwork for hero section')
          setHeroPublicId(res.data.hero?.publicId)
          setAboutImageUrl(res.data.aboutImage?.imageUrl || '')
          setAboutImageAlt(res.data.aboutImage?.imageAlt || 'About section image')
          setAboutPublicId(res.data.aboutImage?.publicId)
          setCvUrl(res.data.cv?.url || '')
          setCvFileName(res.data.cv?.fileName || 'CV')
          setCvPublicId(res.data.cv?.publicId)
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

  const handleAboutImageChange = (url: string, alt: string, publicId?: string) => {
    setAboutImageUrl(url)
    setAboutImageAlt(alt || 'About section image')
    setAboutPublicId(publicId)
  }

  const handleCvChange = (url: string, fileName: string, publicId?: string) => {
    setCvUrl(url)
    setCvFileName(fileName || 'CV')
    setCvPublicId(publicId)
    setCvDirty(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload: any = {
        hero: {
          imageUrl: heroImageUrl,
          imageAlt: heroImageAlt,
          publicId: heroPublicId,
        },
        aboutImage: {
          imageUrl: aboutImageUrl,
          imageAlt: aboutImageAlt,
          publicId: aboutPublicId,
        },
      }

      // Only update CV when it has actually been changed in this session
      if (cvDirty) {
        payload.cv = {
          url: cvUrl,
          fileName: cvFileName,
          publicId: cvPublicId,
        }
      }

      const res = await apiClient.put<Site>('/api/site', payload)
      if (res.success) {
        alert('Site settings saved successfully')
        if (res.data) setSite(res.data)
        // After a successful save, CV is in sync with backend again
        setCvDirty(false)
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
          <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Hero Portrait</label>
                <HeroImageUpload
                  imageUrl={heroImageUrl}
                  imageAlt={heroImageAlt}
                  onChange={handleHeroImageChange}
                  folder="portfolio/hero"
                  inputId="hero-image-upload"
                />
              </div>
              {heroImageUrl && (
                <div>
                  <label className="mb-2 block text-sm font-medium">Hero image alt text</label>
                  <Input
                    value={heroImageAlt}
                    onChange={(e) => setHeroImageAlt(e.target.value)}
                    placeholder="Portrait artwork for hero section"
                  />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">About section image</label>
                <HeroImageUpload
                  imageUrl={aboutImageUrl}
                  imageAlt={aboutImageAlt}
                  onChange={handleAboutImageChange}
                  folder="portfolio/about"
                  inputId="about-image-upload"
                />
              </div>
              {aboutImageUrl && (
                <div>
                  <label className="mb-2 block text-sm font-medium">About image alt text</label>
                  <Input
                    value={aboutImageAlt}
                    onChange={(e) => setAboutImageAlt(e.target.value)}
                    placeholder="About section image"
                  />
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">CV (PDF)</label>
                <p className="mb-2 text-xs text-gray-500">
                  Upload your latest resume as a PDF. This will be used for the public View / Download CV buttons.
                </p>
                <CvUpload
                  cvUrl={cvUrl}
                  fileName={cvFileName}
                  onChange={handleCvChange}
                  folder="portfolio/cv"
                  inputId="cv-upload"
                />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import apiClient from '@/services/apiClient'

interface HeroImageUploadProps {
  imageUrl: string
  imageAlt: string
  onChange: (url: string, alt: string, publicId?: string) => void
}

export default function HeroImageUpload({
  imageUrl,
  imageAlt,
  onChange,
}: HeroImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'portfolio/hero')

      const response = await apiClient.upload<{
        secure_url: string
        public_id: string
      }>('/api/upload', formData)

      if (response.success && response.data) {
        onChange(response.data.secure_url, file.name.replace(/\.[^/.]+$/, ''), response.data.public_id)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error: any) {
      alert(error?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    onChange('', 'Portrait artwork for hero section', undefined)
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="hero-image-upload"
      />
      {imageUrl ? (
        <div className="relative inline-block">
          <div className="relative h-48 w-36 overflow-hidden rounded-lg border border-gray-200 md:h-64 md:w-48">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 144px, 192px"
            />
          </div>
          <div className="mt-2 flex gap-2">
            <label htmlFor="hero-image-upload">
              <Button type="button" variant="outline" size="sm" disabled={uploading}>
                <Upload className="mr-1 h-4 w-4" />
                {uploading ? 'Uploading...' : 'Replace'}
              </Button>
            </label>
            <Button type="button" variant="destructive" size="sm" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-48 w-36 flex-col gap-2 md:h-64 md:w-48"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-10 w-10 text-gray-400" />
          <span className="text-sm">{uploading ? 'Uploading...' : 'Upload hero image'}</span>
        </Button>
      )}
    </div>
  )
}

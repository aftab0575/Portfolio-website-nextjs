'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, X, Upload } from 'lucide-react'
import { Image } from '@/types/project'
import apiClient from '@/services/apiClient'

interface ImageUploadProps {
  images: Image[]
  onChange: (images: Image[]) => void
  maxImages?: number
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'portfolio')

        const response = await apiClient.upload<{
          secure_url: string
          public_id: string
          width: number
          height: number
          format: string
        }>('/api/upload', formData)

        if (response.success && response.data) {
          return {
            url: response.data.secure_url,
            publicId: response.data.public_id,
            alt: file.name,
            order: images.length,
          }
        }
        throw new Error('Upload failed')
      })

      const newImages = await Promise.all(uploadPromises)
      onChange([...images, ...newImages])
    } catch (error: any) {
      alert(error.message || 'Failed to upload images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    // Reorder remaining images
    const reordered = newImages.map((img, i) => ({ ...img, order: i }))
    onChange(reordered)
  }

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return
    }

    const newImages = [...images]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ]

    const reordered = newImages.map((img, i) => ({ ...img, order: i }))
    onChange(reordered)
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            type="button"
            variant="outline"
            disabled={uploading || images.length >= maxImages}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Uploading...' : `Upload Images (${images.length}/${maxImages})`}
          </Button>
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group border rounded-lg overflow-hidden">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                Order: {image.order + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


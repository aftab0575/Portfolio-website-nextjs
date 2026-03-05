'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileText, X } from 'lucide-react'
import apiClient from '@/services/apiClient'

interface CvUploadProps {
  cvUrl: string
  fileName: string
  onChange: (url: string, fileName: string, publicId?: string) => void
  folder?: string
  inputId?: string
}

export default function CvUpload({
  cvUrl,
  fileName,
  onChange,
  folder = 'portfolio/cv',
  inputId = 'cv-upload',
}: CvUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isPdfMime =
      file.type === 'application/pdf' || file.type === 'application/x-pdf'
    const isPdfName = file.name.toLowerCase().endsWith('.pdf')

    if (!isPdfMime && !isPdfName) {
      alert('Please select a PDF file')
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
      formData.append('folder', folder)

      const response = await apiClient.upload<{
        secure_url: string
        public_id: string
        format: string
      }>('/api/upload-cv', formData)

      if (response.success && response.data) {
        const baseName = file.name.replace(/\.[^/.]+$/, '')
        onChange(response.data.secure_url, baseName || 'CV', response.data.public_id)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error: any) {
      alert(error?.message || 'Failed to upload CV')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    onChange('', 'CV', undefined)
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        className="hidden"
        id={inputId}
      />

      {cvUrl ? (
        <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <FileText className="h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="max-w-xs truncate text-sm font-medium">
                {fileName || 'CV'}
              </span>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary underline underline-offset-2"
              >
                View current CV
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-1 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Replace'}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="flex h-12 min-w-[200px] items-center gap-2"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          <span className="text-sm">
            {uploading ? 'Uploading...' : 'Upload CV (PDF)'}
          </span>
        </Button>
      )}
    </div>
  )
}


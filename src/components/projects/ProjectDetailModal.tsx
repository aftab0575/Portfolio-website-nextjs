'use client'

import Image from 'next/image'
import { X, ExternalLink, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Project } from '@/types/project'
import { routes } from '@/constants/routes'

interface ProjectDetailModalProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onExitComplete?: () => void
}

function formatPublishedDate(date: Date | string | undefined): string | null {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ProjectDetailModal({
  project,
  open,
  onOpenChange,
  onExitComplete,
}: ProjectDetailModalProps) {
  if (!project) return null

  const images = project.images ?? []
  const publishedDate = formatPublishedDate(project.createdAt)

  const descriptionLines = project.description
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const handleClose = () => onOpenChange(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange} onExitComplete={onExitComplete}>
      <DialogContent
        className="w-[90vw] max-w-[90vw] max-h-[90vh] p-0 gap-0 overflow-hidden border-0 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full-width title header with blurred transparent bg */}
        <div className="flex items-center justify-between gap-4 px-6 py-6 backdrop-blur-xl bg-black/30 border-b border-white/10 md:rounded-t-lg shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white break-words min-w-0 flex-1 pr-4">
            {project.title}
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 -mr-2 shrink-0"
              onClick={handleClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-[35%_65%] min-h-0 flex-1 overflow-y-auto md:overflow-hidden md:min-h-[50vh]">
          {/* Left: Project details (dark) - full height on mobile, scrolls on desktop */}
          <div className="flex flex-col bg-zinc-900 text-white p-6 py-8 md:py-6 md:rounded-bl-lg overflow-hidden md:overflow-y-auto overflow-x-hidden min-w-0 shrink-0 md:min-h-0">
            {descriptionLines.length > 0 && (
              <div className="mb-8 md:mb-6 min-w-0">
                <ul className="space-y-3 md:space-y-2 list-disc list-inside text-zinc-300 text-base md:text-sm leading-relaxed break-words">
                  {descriptionLines.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.techStack.length > 0 && (
              <div className="mb-8 md:mb-6">
                <p className="text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Skills & deliverables
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-white/20 text-white rounded-md text-sm font-medium border border-white/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {publishedDate && (
              <p className="text-sm text-zinc-400 mt-auto">
                Published on: {publishedDate}
              </p>
            )}

            {(project.githubUrl || project.liveUrl) && (
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                      View Code
                    </Button>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Live Demo
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right: Scrollable photos (light) - single scroll on mobile, separate on desktop */}
          <div className="flex flex-col bg-muted/50 md:rounded-br-lg overflow-visible md:overflow-hidden min-w-0 shrink-0">
            <div className="flex-1 overflow-visible md:overflow-y-auto p-4 min-h-0">
              {images.length > 0 ? (
                <div className="space-y-6 divide-y divide-primary/30">
                  {images.map((img, i) => (
                    <div
                      key={img.publicId ?? i}
                      className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted shrink-0 py-4 first:pt-0 last:pb-0 border border-primary/50 shadow-[0_4px_14px_hsl(var(--primary)/0.12),0_2px_6px_hsl(var(--foreground)/0.08)]"
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || `${project.title} screenshot ${i + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 650px"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <p className="text-sm">No photos</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

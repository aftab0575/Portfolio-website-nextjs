'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProjectBySlug } from '@/store/slices/projectsSlice'
import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'
import Loader from '@/components/common/Loader'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentProject, isLoading, error } = useAppSelector((state) => state.projects)
  const slug = params.slug as string

  useEffect(() => {
    if (slug) {
      dispatch(fetchProjectBySlug(slug))
    }
  }, [dispatch, slug])

  if (isLoading) {
    return (
      <main className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        </div>
      </main>
    )
  }

  if (error || !currentProject) {
    return (
      <main className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Project not found.</p>
            <Button onClick={() => router.push('/projects')}>Back to Projects</Button>
          </div>
        </div>
      </main>
    )
  }

  const project = currentProject

  return (
    <main className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{project?.title}</h1>
            {project?.category && (
              <span className="text-gray-600 mb-6 block">{project.category}</span>
            )}

            {project?.images && project.images.length > 0 && (
              <div className="mb-8">
                <div className="relative h-96 w-full rounded-lg overflow-hidden">
                  <Image
                    src={project.images[0].url}
                    alt={project.images[0].alt}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                  />
                </div>
              </div>
            )}

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed">{project?.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project?.techStack?.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {project?.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <Github className="mr-2 h-4 w-4" />
                    View Code
                  </Button>
                </a>
              )}
              {project?.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
    </main>
  )
}


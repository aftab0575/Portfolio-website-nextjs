import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Project } from '@/types/project'
import { routes } from '@/constants/routes'
import { ImageIcon } from 'lucide-react'

interface ProjectCardProps {
  project: Project
  showCategory?: boolean
  showTechStack?: boolean
  maxTechStack?: number
  linkPath?: string
  buttonText?: string
  /** When provided, opens modal instead of linking to detail page */
  onViewProject?: (project: Project) => void
}

const ProjectCard = memo(function ProjectCard({
  project,
  showCategory = false,
  showTechStack = true,
  maxTechStack = 4,
  linkPath,
  buttonText = 'View Project',
  onViewProject,
}: ProjectCardProps) {
  const projectLink = linkPath || `${routes.projects}/${project.slug}`
  const images = project.images ?? []
  const thumbUrl = images.length > 0 ? images[0].url : null
  const thumbAlt = images.length > 0 ? images[0].alt : project.title

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-muted shrink-0">
        {thumbUrl ? (
          <Image
            src={thumbUrl}
            alt={thumbAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
            <ImageIcon className="h-16 w-16" aria-hidden />
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          {project.isFeatured && (
            <span className="px-2 py-1 text-xs bg-primary text-white rounded">
              Featured
            </span>
          )}
        </div>
        {showCategory && project.category && (
          <span className="text-sm text-gray-500 mb-2 block">
            {project.category}
          </span>
        )}
        <p className="text-gray-600 text-sm line-clamp-3 min-h-[4.125rem] mb-4">
          {project.description}
        </p>
        {showTechStack && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, maxTechStack).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs bg-gray-900 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        {onViewProject ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onViewProject(project)}
          >
            {buttonText}
          </Button>
        ) : (
          <Link href={projectLink}>
            <Button variant="outline" className="w-full">
              {buttonText}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
})

export default ProjectCard
import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Project } from '@/types/project'
import { routes } from '@/constants/routes'

interface ProjectCardProps {
  project: Project
  showCategory?: boolean
  showTechStack?: boolean
  maxTechStack?: number
  linkPath?: string
  buttonText?: string
}

const ProjectCard = memo(function ProjectCard({
  project,
  showCategory = false,
  showTechStack = true,
  maxTechStack = 4,
  linkPath,
  buttonText = 'View Project'
}: ProjectCardProps) {
  const projectLink = linkPath || `${routes.projects}/${project.slug}`

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {project.images.length > 0 && (
        <div className="relative h-48 w-full">
          <Image
            src={project.images[0].url}
            alt={project.images[0].alt}
            fill
            className="object-cover"
          />
        </div>
      )}
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
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {project.description}
        </p>
        {showTechStack && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, maxTechStack).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs bg-gray-100 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <Link href={projectLink}>
          <Button variant="outline" className="w-full">
            {buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
})

export default ProjectCard
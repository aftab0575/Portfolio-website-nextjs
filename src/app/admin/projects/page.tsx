'use client'

import { useEffect, useState, useRef, memo, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProjects, deleteProject } from '@/store/slices/projectsSlice'
import { 
  selectAllProjects, 
  selectProjectsLoading, 
  selectProjectsError,
  selectShouldFetchProjects 
} from '@/store/selectors'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Project } from '@/types/project'
import { useProjectsApiGuards } from '@/hooks/useApiGuards'
import useRenderCount from '@/hooks/useRenderCount'

// Memoized project card for admin
const AdminProjectCard = memo(function AdminProjectCard({ 
  project, 
  onDelete, 
  isDeleting 
}: { 
  project: Project
  onDelete: (id: string) => void
  isDeleting: boolean
}) {
  const handleDelete = useCallback(() => {
    onDelete(project._id!)
  }, [onDelete, project._id])

  return (
    <Card key={project._id}>
      <CardHeader>
        <CardTitle className="line-clamp-2">{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.slice(0, 3).map((tech: string) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs bg-gray-100 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/projects/${project._id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

// Memoized projects grid
const AdminProjectsGrid = memo(function AdminProjectsGrid({ 
  projects, 
  onDelete, 
  deletingId 
}: { 
  projects: Project[]
  onDelete: (id: string) => void
  deletingId: string | null
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project: Project) => (
        <AdminProjectCard
          key={project._id}
          project={project}
          onDelete={onDelete}
          isDeleting={deletingId === project._id}
        />
      ))}
    </div>
  )
})

// Memoized empty state
const EmptyState = memo(function EmptyState() {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-gray-600">No projects yet. Create your first project!</p>
        <Link href="/admin/projects/new">
          <Button className="mt-4">Create Project</Button>
        </Link>
      </CardContent>
    </Card>
  )
})

const AdminProjectsPage = memo(function AdminProjectsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const projects = useAppSelector(selectAllProjects)
  const isLoading = useAppSelector(selectProjectsLoading)
  const error = useAppSelector(selectProjectsError)
  const shouldFetch = useAppSelector(state => selectShouldFetchProjects(state))
  const hasFetched = useRef(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  // Use API guards to prevent cascading calls
  const projectsGuards = useProjectsApiGuards({ debug: true })

  // Add render count monitoring for debugging
  useRenderCount({ 
    componentName: 'AdminProjectsPage',
    logToConsole: process.env.NODE_ENV === 'development'
  })

  useEffect(() => {
    // Check API guards before fetching
    const guardResult = projectsGuards.checkFetchProjects()
    
    // Only fetch if guards allow it and we should fetch (no valid cache) and haven't fetched yet
    if (guardResult.allowed && shouldFetch && !hasFetched.current && !isLoading && !error) {
      hasFetched.current = true
      projectsGuards.registerApiCall('projects/fetchAll')
      dispatch(fetchProjects())
    } else if (!guardResult.allowed) {
      console.log(`[Admin Projects] API call blocked: ${guardResult.reason}`)
      
      // If we have cached result, we can still show the UI
      if (guardResult.cachedResult) {
        console.log('[Admin Projects] Using cached result from API guards')
      }
    }
  }, []) // Empty dependency array prevents infinite loops

  const handleDelete = useCallback(async (id: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this project?')) return

    setDeletingId(id)
    try {
      await dispatch(deleteProject(id)).unwrap()
    } catch (error) {
      alert('Failed to delete project')
    } finally {
      setDeletingId(null)
    }
  }, [dispatch])

  if (isLoading) {
    return <div className="text-center py-12">Loading projects...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="mt-2 text-gray-600">Manage your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <AdminProjectsGrid 
          projects={projects}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}
    </div>
  )
})

export default AdminProjectsPage


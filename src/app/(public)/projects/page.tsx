'use client'

import { useEffect, useRef, memo, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProjects } from '@/store/slices/projectsSlice'
import { 
  selectAllProjects, 
  selectProjectsLoading, 
  selectProjectsError,
  selectShouldFetchProjects 
} from '@/store/selectors'
import Loader from '@/components/common/Loader'
import ProjectCard from '@/components/common/ProjectCard'
import useRenderCount from '@/hooks/useRenderCount'

// Memoized projects grid to prevent unnecessary re-renders
const ProjectsGrid = memo(function ProjectsGrid({ projects }: { projects: any[] }) {
  const projectCards = useMemo(() => 
    projects.map((project) => (
      <ProjectCard
        key={project._id}
        project={project}
        showCategory={true}
        showTechStack={true}
        maxTechStack={4}
        buttonText="View Details"
      />
    )), 
    [projects]
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projectCards}
    </div>
  )
})

const ProjectsPage = memo(function ProjectsPage() {
  const dispatch = useAppDispatch()
  const projects = useAppSelector(selectAllProjects)
  const isLoading = useAppSelector(selectProjectsLoading)
  const error = useAppSelector(selectProjectsError)
  const shouldFetch = useAppSelector(state => selectShouldFetchProjects(state))
  const hasFetched = useRef(false)

  // Add render count monitoring for debugging
  useRenderCount({ 
    componentName: 'ProjectsPage',
    logToConsole: process.env.NODE_ENV === 'development'
  })

  useEffect(() => {
    // Only fetch if we should fetch (no valid cache) and haven't fetched yet
    if (shouldFetch && !hasFetched.current && !isLoading && !error) {
      hasFetched.current = true
      dispatch(fetchProjects())
    }
  }, []) // Empty dependency array to prevent infinite loops

  return (
    <main className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-12 text-center">My Projects</h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No projects available yet.</p>
            </div>
          ) : (
            <ProjectsGrid projects={projects} />
          )}
        </div>
    </main>
  )
})

export default ProjectsPage


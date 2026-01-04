'use client'

import { useEffect, useRef, memo, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/constants/site'
import { routes } from '@/constants/routes'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProjects } from '@/store/slices/projectsSlice'
import { 
  selectProjectsForHomePage, 
  selectProjectsLoading, 
  selectProjectsError,
  selectShouldFetchProjects 
} from '@/store/selectors'
import Loader from '@/components/common/Loader'
import ProjectCard from '@/components/common/ProjectCard'
import useRenderCount from '@/hooks/useRenderCount'

// Memoized hero section to prevent unnecessary re-renders
const HeroSection = memo(function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary">
          {siteConfig.name}
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-4">{siteConfig.role}</p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          {siteConfig.bio}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href={routes.projects}>
            <Button size="lg">View Projects</Button>
          </Link>
          <Link href={routes.contact}>
            <Button size="lg" variant="outline">
              Get In Touch
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
})

// Memoized featured projects section
const FeaturedProjectsSection = memo(function FeaturedProjectsSection({
  projects,
  isLoading
}: {
  projects: any[]
  isLoading: boolean
}) {
  const projectCards = useMemo(() => 
    projects.map((project) => (
      <ProjectCard
        key={project._id}
        project={project}
        buttonText="View Project"
      />
    )), 
    [projects]
  )

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectCards}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured projects available yet.</p>
          </div>
        )}
      </div>
    </section>
  )
})

const HomePage = memo(function HomePage() {
  const dispatch = useAppDispatch()
  const featuredProjects = useAppSelector(selectProjectsForHomePage)
  const isLoading = useAppSelector(selectProjectsLoading)
  const error = useAppSelector(selectProjectsError)
  const shouldFetch = useAppSelector(state => selectShouldFetchProjects(state, { isFeatured: true }))
  const hasFetched = useRef(false)

  // Add render count monitoring for debugging
  useRenderCount({ 
    componentName: 'HomePage',
    logToConsole: process.env.NODE_ENV === 'development'
  })

  useEffect(() => {
    // Only fetch if we should fetch (no valid cache) and haven't fetched yet
    if (shouldFetch && !hasFetched.current && !isLoading && !error) {
      hasFetched.current = true
      dispatch(fetchProjects({ isFeatured: true }))
    }
  }, []) // Empty dependency array prevents infinite loops

  return (
    <main>
      <HeroSection />
      <FeaturedProjectsSection 
        projects={featuredProjects}
        isLoading={isLoading}
      />
    </main>
  )
})

export default HomePage

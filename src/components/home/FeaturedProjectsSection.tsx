'use client'

import { memo, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import StackedCarousel, { CarouselItem } from '@/components/ui/stacked-carousel'
import Loader from '@/components/common/Loader'
import ProjectCard from '@/components/common/ProjectCard'
import { routes } from '@/constants/routes'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectProjectsForHomePage,
  selectProjectsLoading,
  selectProjectsError,
  selectShouldFetchProjects,
} from '@/store/selectors'
import { fetchProjects } from '@/store/slices/projectsSlice'

const FeaturedProjectsSection = memo(function FeaturedProjectsSection() {
  const dispatch = useAppDispatch()
  const featuredProjects = useAppSelector(selectProjectsForHomePage)
  const isLoading = useAppSelector(selectProjectsLoading)
  const error = useAppSelector(selectProjectsError)
  const shouldFetch = useAppSelector((state) =>
    selectShouldFetchProjects(state, { isFeatured: true }),
  )
  const hasFetched = useRef(false)

  const sectionRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(sectionRef, { margin: '-100px', amount: 0.2 })

  useEffect(() => {
    if (shouldFetch && !hasFetched.current && !isLoading && !error) {
      hasFetched.current = true
      dispatch(fetchProjects({ isFeatured: true }))
    }
  }, [dispatch, shouldFetch, isLoading, error])

  // Convert projects to carousel format
  const projectCarouselData: CarouselItem[] = useMemo(
    () =>
      featuredProjects.slice(0, 4).map((project) => ({
        id: project._id ?? project.slug,
        title: project.title,
        subtitle: project.techStack?.slice(0, 3).join(' • ') || 'Featured Project',
        image:
          project.images?.[0]?.url ||
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        description: project.description,
      })),
    [featuredProjects],
  )

  const projectCards = useMemo(
    () =>
      featuredProjects.slice(0, 3).map((project) => (
        <ProjectCard
          key={project._id ?? project.slug}
          project={project}
          buttonText="View Project"
          showTechStack
          maxTechStack={3}
        />
      )),
    [featuredProjects],
  )

  const handleProjectClick = (project: CarouselItem) => {
    console.log('Project clicked:', project.title)
    // Navigate to project detail page
    // router.push(`/projects/${project.id}`)
  }

  return (
    <section id="projects" ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            A showcase of my recent work and technical expertise
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : featuredProjects.length > 0 ? (
          <>
            {projectCarouselData.length > 0 ? (
              <>
                {/* Stacked Carousel for Projects */}
                <StackedCarousel
                  items={projectCarouselData}
                  autoPlay={isInView}
                  autoPlayInterval={8000}
                  onItemClick={handleProjectClick}
                  className="mb-8"
                />

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Click projects to view details • Auto-play pauses when out of view
                  </p>
                </div>
              </>
            ) : (
              /* Traditional Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {projectCards}
              </div>
            )}

            <div className="text-center">
              <Link href={routes.sections.contact}>
                <Button size="lg" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Me
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured projects available yet.</p>
          </div>
        )}
      </div>
    </section>
  )
})

export default FeaturedProjectsSection


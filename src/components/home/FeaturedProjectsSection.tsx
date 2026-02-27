'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import Loader from '@/components/common/Loader'
import ProjectCard from '@/components/common/ProjectCard'
import ProjectDetailModal from '@/components/projects/ProjectDetailModal'
import ElectricBorder from '@/components/ElectricBorder'
import { routes } from '@/constants/routes'
import { Project } from '@/types/project'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectProjectsForHomePage,
  selectProjectsLoading,
  selectProjectsError,
  selectShouldFetchProjects,
} from '@/store/selectors'
import { fetchProjects } from '@/store/slices/projectsSlice'

const DEFAULT_BORDER_COLOR = '#7df9ff'

const FeaturedProjectsSection = memo(function FeaturedProjectsSection() {
  const dispatch = useAppDispatch()
  const featuredProjects = useAppSelector(selectProjectsForHomePage)
  const isLoading = useAppSelector(selectProjectsLoading)
  const error = useAppSelector(selectProjectsError)
  const shouldFetch = useAppSelector((state) =>
    selectShouldFetchProjects(state, { isFeatured: true }),
  )
  const activeTheme = useAppSelector((state) => state.theme.activeTheme)
  const hasFetched = useRef(false)
  const [electricBorderColor, setElectricBorderColor] = useState(DEFAULT_BORDER_COLOR)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleViewProject = useCallback((project: Project) => {
    setSelectedProject(project)
    setModalOpen(true)
  }, [])

  const handleModalClose = useCallback((open: boolean) => {
    setModalOpen(open)
  }, [])

  const handleModalExitComplete = useCallback(() => {
    setSelectedProject(null)
  }, [])

  useEffect(() => {
    if (activeTheme?.variables?.primary) {
      setElectricBorderColor(activeTheme.variables.primary)
    } else if (activeTheme?.variables?.accent) {
      setElectricBorderColor(activeTheme.variables.accent)
    } else {
      const cssPrimary = typeof document !== 'undefined'
        ? getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim()
        : ''
      setElectricBorderColor(cssPrimary || DEFAULT_BORDER_COLOR)
    }
  }, [activeTheme])

  useEffect(() => {
    if (shouldFetch && !hasFetched.current && !isLoading && !error) {
      hasFetched.current = true
      dispatch(fetchProjects({ isFeatured: true }))
    }
  }, [dispatch, shouldFetch, isLoading, error])

  const projectCards = useMemo(
    () =>
      featuredProjects.slice(0, 3).map((project) => (
        <ElectricBorder
          key={project._id ?? project.slug}
          color={electricBorderColor}
          speed={1}
          chaos={0.12}
          borderRadius={16}
          style={{ borderRadius: 16 }}
          className="w-full rounded-2xl"
        >
          <ProjectCard
            project={project}
            buttonText="View Project"
            showTechStack
            maxTechStack={3}
            onViewProject={handleViewProject}
          />
        </ElectricBorder>
      )),
    [featuredProjects, electricBorderColor, handleViewProject],
  )

  return (
    <section id="projects" className="py-20 bg-muted/30">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">{projectCards}</div>

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

      <ProjectDetailModal
        project={selectedProject}
        open={modalOpen}
        onOpenChange={handleModalClose}
        onExitComplete={handleModalExitComplete}
      />
    </section>
  )
})

export default FeaturedProjectsSection


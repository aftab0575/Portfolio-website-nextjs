'use client'

import { useEffect, useState, memo, useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProjects } from '@/store/slices/projectsSlice'
import { fetchSkills } from '@/store/slices/skillsSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderKanban, Code, Mail, TrendingUp, LucideIcon } from 'lucide-react'
import apiClient from '@/services/apiClient'
import { useProjectsApiGuards, useSkillsApiGuards } from '@/hooks/useApiGuards'
import { selectDashboardStats } from '@/store/selectors'
import useRenderCount from '@/hooks/useRenderCount'

interface DashboardStat {
  title: string
  value: number
  icon: LucideIcon
  color: string
  bgColor: string
}

// Memoized stat card component
const StatCard = memo(function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = stat.icon
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {stat.title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
          <Icon className={`h-5 w-5 ${stat.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{stat.value}</div>
      </CardContent>
    </Card>
  )
})

// Memoized quick actions component
const QuickActions = memo(function QuickActions() {
  const actions = useMemo(() => [
    {
      href: "/admin/projects/new",
      title: "Create New Project",
      description: "Add a new project to your portfolio"
    },
    {
      href: "/admin/skills",
      title: "Manage Skills",
      description: "Update your skills and categories"
    },
    {
      href: "/admin/messages",
      title: "View Messages",
      description: "Check your contact messages"
    }
  ], [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold">{action.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{action.description}</p>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})

const DashboardPage = memo(function DashboardPage() {
  const dispatch = useAppDispatch()
  const { projects, isLoading: projectsLoading } = useAppSelector((state) => state.projects)
  const { skills, isLoading: skillsLoading } = useAppSelector((state) => state.skills)
  const dashboardStats = useAppSelector(selectDashboardStats)
  const [unreadMessages, setUnreadMessages] = useState<number>(0)
  
  // Use API guards to prevent cascading calls
  const projectsGuards = useProjectsApiGuards({ debug: true })
  const skillsGuards = useSkillsApiGuards({ debug: true })

  // Add render count monitoring for debugging
  useRenderCount({ 
    componentName: 'DashboardPage',
    logToConsole: process.env.NODE_ENV === 'development'
  })

  const fetchUnreadMessages = useCallback(async (): Promise<void> => {
    try {
      const response = await apiClient.get<{ count: number }>('/api/contact/unread-count')
      if (response.success && response.data) {
        setUnreadMessages(response.data.count)
      }
    } catch (error) {
      console.error('Failed to fetch unread messages:', error)
    }
  }, [])

  useEffect(() => {
    // Check if we should fetch projects
    const projectsGuardResult = projectsGuards.checkFetchProjects()
    if (projectsGuardResult.allowed && projects.length === 0 && !projectsLoading) {
      projectsGuards.registerApiCall('projects/fetchAll')
      dispatch(fetchProjects())
    }
    
    // Check if we should fetch skills
    const skillsGuardResult = skillsGuards.checkFetchSkills(true)
    if (skillsGuardResult.allowed && skills.length === 0 && !skillsLoading) {
      skillsGuards.registerApiCall('skills/fetchAll', { activeOnly: true })
      dispatch(fetchSkills(true))
    }
    
    // Fetch unread messages (not guarded as it's a different endpoint)
    fetchUnreadMessages()
  }, []) // Empty dependency array with proper guards

  const stats: DashboardStat[] = useMemo(() => [
    {
      title: 'Total Projects',
      value: dashboardStats.projects.total,
      icon: FolderKanban,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Skills',
      value: dashboardStats.skills.total,
      icon: Code,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Unread Messages',
      value: unreadMessages,
      icon: Mail,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Featured Projects',
      value: dashboardStats.projects.featured,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ], [dashboardStats, unreadMessages])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      <div className="mt-8">
        <QuickActions />
      </div>
    </div>
  )
})

export default DashboardPage


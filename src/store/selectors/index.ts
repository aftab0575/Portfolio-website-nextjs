import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { 
  generateRequestKey, 
  shouldAllowRequest, 
  isRequestOngoing,
  hasValidCompletedRequest 
} from '@/utils/apiGuards'

// Memoized selectors to prevent unnecessary re-renders

// Projects selectors
export const selectProjectsState = (state: RootState) => state.projects
export const selectSkillsState = (state: RootState) => state.skills
export const selectExperienceState = (state: RootState) => state.experience

// Memoized project selectors
export const selectAllProjects = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.projects
)

export const selectFeaturedProjects = createSelector(
  [selectAllProjects],
  (projects) => projects.filter(project => project.isFeatured)
)

export const selectProjectsByCategory = createSelector(
  [selectAllProjects, (state: RootState, category: string) => category],
  (projects, category) => projects.filter(project => project.category === category)
)

export const selectProjectsLoading = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.isLoading
)

export const selectProjectsError = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.error
)

// Memoized skills selectors
export const selectAllSkills = createSelector(
  [selectSkillsState],
  (skillsState) => skillsState.skills
)

export const selectActiveSkills = createSelector(
  [selectAllSkills],
  (skills) => skills.filter(skill => skill.isActive)
)

export const selectSkillsByCategory = createSelector(
  [selectAllSkills, (state: RootState, category: string) => category],
  (skills, category) => skills.filter(skill => skill.category === category)
)

export const selectSkillCategories = createSelector(
  [selectAllSkills],
  (skills) => Array.from(new Set(skills.map(skill => skill.category)))
)

export const selectSkillsLoading = createSelector(
  [selectSkillsState],
  (skillsState) => skillsState.isLoading
)

export const selectSkillsError = createSelector(
  [selectSkillsState],
  (skillsState) => skillsState.error
)

// Memoized experience selectors
export const selectAllExperiences = createSelector(
  [selectExperienceState],
  (experienceState) => experienceState.experiences
)

export const selectCurrentExperiences = createSelector(
  [selectAllExperiences],
  (experiences) => experiences.filter(exp => !exp.endDate)
)

export const selectPastExperiences = createSelector(
  [selectAllExperiences],
  (experiences) => experiences.filter(exp => exp.endDate)
)

export const selectExperiencesLoading = createSelector(
  [selectExperienceState],
  (experienceState) => experienceState.isLoading
)

export const selectExperiencesError = createSelector(
  [selectExperienceState],
  (experienceState) => experienceState.error
)

// Cache status selectors
export const selectProjectsCacheStatus = createSelector(
  [selectProjectsState],
  (projectsState) => ({
    featuredProjects: {
      isValid: projectsState.cache.featuredProjects.timestamp !== null &&
               Date.now() - projectsState.cache.featuredProjects.timestamp < 5 * 60 * 1000,
      timestamp: projectsState.cache.featuredProjects.timestamp,
      count: projectsState.cache.featuredProjects.data.length
    },
    allProjects: {
      isValid: projectsState.cache.allProjects.timestamp !== null &&
               Date.now() - projectsState.cache.allProjects.timestamp < 5 * 60 * 1000,
      timestamp: projectsState.cache.allProjects.timestamp,
      count: projectsState.cache.allProjects.data.length
    }
  })
)

export const selectSkillsCacheStatus = createSelector(
  [selectSkillsState],
  (skillsState) => ({
    allSkills: {
      isValid: skillsState.cache.allSkills.timestamp !== null &&
               Date.now() - skillsState.cache.allSkills.timestamp < 5 * 60 * 1000,
      timestamp: skillsState.cache.allSkills.timestamp,
      count: skillsState.cache.allSkills.data.length
    },
    activeSkills: {
      isValid: skillsState.cache.activeSkills.timestamp !== null &&
               Date.now() - skillsState.cache.activeSkills.timestamp < 5 * 60 * 1000,
      timestamp: skillsState.cache.activeSkills.timestamp,
      count: skillsState.cache.activeSkills.data.length
    }
  })
)

export const selectExperiencesCacheStatus = createSelector(
  [selectExperienceState],
  (experienceState) => ({
    isValid: experienceState.cache.timestamp !== null &&
             Date.now() - experienceState.cache.timestamp < 5 * 60 * 1000,
    timestamp: experienceState.cache.timestamp,
    count: experienceState.cache.data.length
  })
)

// Navigation optimization selectors - check if data should be fetched
export const selectShouldFetchProjects = createSelector(
  [selectProjectsCacheStatus, (state: RootState, filters?: { isFeatured?: boolean }) => filters],
  (cacheStatus, filters) => {
    // First check Redux cache
    const shouldFetchFromCache = filters?.isFeatured === true
      ? (!cacheStatus.featuredProjects.isValid || cacheStatus.featuredProjects.count === 0)
      : (!cacheStatus.allProjects.isValid || cacheStatus.allProjects.count === 0)
    
    if (!shouldFetchFromCache) {
      return false // Don't fetch if we have valid cache
    }
    
    // Check API guards to prevent cascading calls
    const requestKey = generateRequestKey('projects/fetchAll', filters)
    const guardResult = shouldAllowRequest(requestKey, {
      respectCooldown: true,
      respectOngoing: true,
      respectCompleted: true
    })
    
    return guardResult.allowed
  }
)

export const selectShouldFetchSkills = createSelector(
  [selectSkillsCacheStatus, (state: RootState, activeOnly: boolean = false) => activeOnly],
  (cacheStatus, activeOnly) => {
    // First check Redux cache
    const shouldFetchFromCache = activeOnly
      ? (!cacheStatus.activeSkills.isValid || cacheStatus.activeSkills.count === 0)
      : (!cacheStatus.allSkills.isValid || cacheStatus.allSkills.count === 0)
    
    if (!shouldFetchFromCache) {
      return false // Don't fetch if we have valid cache
    }
    
    // Check API guards to prevent cascading calls
    const requestKey = generateRequestKey('skills/fetchAll', { activeOnly })
    const guardResult = shouldAllowRequest(requestKey, {
      respectCooldown: true,
      respectOngoing: true,
      respectCompleted: true
    })
    
    return guardResult.allowed
  }
)

export const selectShouldFetchExperiences = createSelector(
  [selectExperiencesCacheStatus],
  (cacheStatus) => {
    // First check Redux cache
    if (cacheStatus.isValid && cacheStatus.count > 0) {
      return false // Don't fetch if we have valid cache
    }
    
    // Check API guards to prevent cascading calls
    const requestKey = generateRequestKey('experience/fetchAll')
    const guardResult = shouldAllowRequest(requestKey, {
      respectCooldown: true,
      respectOngoing: true,
      respectCompleted: true
    })
    
    return guardResult.allowed
  }
)

// API Guard status selectors for debugging and monitoring
export const selectApiGuardStatus = createSelector(
  [(state: RootState, requestKey: string) => requestKey],
  (requestKey) => {
    const isOngoing = isRequestOngoing(requestKey)
    const { isValid: hasCompleted, result } = hasValidCompletedRequest(requestKey)
    const guardResult = shouldAllowRequest(requestKey)
    
    return {
      requestKey,
      isOngoing,
      hasCompleted,
      cachedResult: result,
      shouldAllow: guardResult.allowed,
      blockReason: guardResult.reason
    }
  }
)

// Selector to check if any API calls are currently in progress
export const selectHasOngoingApiCalls = createSelector(
  [selectProjectsLoading, selectSkillsLoading, selectExperiencesLoading],
  (projectsLoading, skillsLoading, experiencesLoading) => {
    return projectsLoading || skillsLoading || experiencesLoading
  }
)

// Performance optimization selectors
export const selectProjectsForHomePage = createSelector(
  [selectFeaturedProjects],
  (featuredProjects) => featuredProjects.slice(0, 3)
)

export const selectProjectsWithImages = createSelector(
  [selectAllProjects],
  (projects) => projects.filter(project => project.images.length > 0)
)

export const selectProjectStats = createSelector(
  [selectAllProjects],
  (projects) => ({
    total: projects.length,
    featured: projects.filter(p => p.isFeatured).length,
    withImages: projects.filter(p => p.images.length > 0).length,
    categories: Array.from(new Set(projects.map(p => p.category).filter(Boolean))).length
  })
)

export const selectSkillStats = createSelector(
  [selectAllSkills],
  (skills) => ({
    total: skills.length,
    active: skills.filter(s => s.isActive).length,
    categories: Array.from(new Set(skills.map(s => s.category))).length
  })
)

// Memoized selector for dashboard stats to prevent recalculation
export const selectDashboardStats = createSelector(
  [selectProjectStats, selectSkillStats],
  (projectStats, skillStats) => ({
    projects: projectStats,
    skills: skillStats
  })
)
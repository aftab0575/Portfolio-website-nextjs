import ProjectModel from './schema'
import { Project, ProjectFormData } from './types'
import connectDB from '@/services/mongodb'
import { slugify } from '@/utils/slugify'
import logger from '@/utils/logger'

export async function getAllProjects(filters?: {
  isFeatured?: boolean
  category?: string
}): Promise<Project[]> {
  try {
    await connectDB()
    const query: any = {}

    if (filters?.isFeatured !== undefined) {
      query.isFeatured = filters.isFeatured
    }

    if (filters?.category) {
      query.category = filters.category
    }

    const projects = await ProjectModel.find(query).sort({ createdAt: -1 }).lean()
    return projects.map((p) => ({
      ...p,
      _id: p._id.toString(),
    })) as Project[]
  } catch (error: any) {
    logger.error('Get all projects error:', error)
    throw error
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    await connectDB()
    const project = await ProjectModel.findById(id).lean()
    if (!project) return null
    return {
      ...project,
      _id: project._id.toString(),
    } as Project
  } catch (error: any) {
    logger.error('Get project by ID error:', error)
    throw error
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    await connectDB()
    const project = await ProjectModel.findOne({ slug }).lean()
    if (!project) return null
    return {
      ...project,
      _id: project._id.toString(),
    } as Project
  } catch (error: any) {
    logger.error('Get project by slug error:', error)
    throw error
  }
}

export async function createProject(data: ProjectFormData): Promise<Project> {
  try {
    await connectDB()
    const slug = slugify(data.title)

    // Check if slug exists
    const existing = await ProjectModel.findOne({ slug })
    if (existing) {
      throw new Error('A project with this title already exists')
    }

    const project = await ProjectModel.create({
      ...data,
      slug,
    })

    return {
      ...project.toObject(),
      _id: project._id.toString(),
    } as Project
  } catch (error: any) {
    logger.error('Create project error:', error)
    throw error
  }
}

export async function updateProject(id: string, data: Partial<ProjectFormData>): Promise<Project> {
  try {
    await connectDB()

    // Create update data with potential slug
    const updateData: Partial<ProjectFormData & { slug: string }> = { ...data }

    if (data.title) {
      const slug = slugify(data.title)
      const existing = await ProjectModel.findOne({ slug, _id: { $ne: id } })
      if (existing) {
        throw new Error('A project with this title already exists')
      }
      updateData.slug = slug
    }

    const project = await ProjectModel.findByIdAndUpdate(id, updateData, { new: true }).lean()
    if (!project) {
      throw new Error('Project not found')
    }

    return {
      ...project,
      _id: project._id.toString(),
    } as Project
  } catch (error: any) {
    logger.error('Update project error:', error)
    throw error
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await connectDB()
    const project = await ProjectModel.findByIdAndDelete(id)
    if (!project) {
      throw new Error('Project not found')
    }
  } catch (error: any) {
    logger.error('Delete project error:', error)
    throw error
  }
}


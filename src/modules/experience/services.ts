import ExperienceModel from './schema'
import { Experience, ExperienceFormData } from './types'
import connectDB from '@/services/mongodb'
import logger from '@/utils/logger'

export async function getAllExperience(): Promise<Experience[]> {
  try {
    await connectDB()
    const experiences = await ExperienceModel.find()
      .sort({ startDate: -1 })
      .lean()
    return experiences.map((e) => ({
      ...e,
      _id: e._id.toString(),
    })) as Experience[]
  } catch (error: any) {
    logger.error('Get all experience error:', error)
    throw error
  }
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  try {
    await connectDB()
    const experience = await ExperienceModel.findById(id).lean()
    if (!experience) return null
    return {
      ...experience,
      _id: experience._id.toString(),
    } as Experience
  } catch (error: any) {
    logger.error('Get experience by ID error:', error)
    throw error
  }
}

export async function createExperience(data: ExperienceFormData): Promise<Experience> {
  try {
    await connectDB()
    const experience = await ExperienceModel.create(data)
    return {
      ...experience.toObject(),
      _id: experience._id.toString(),
    } as Experience
  } catch (error: any) {
    logger.error('Create experience error:', error)
    throw error
  }
}

export async function updateExperience(
  id: string,
  data: Partial<ExperienceFormData>
): Promise<Experience> {
  try {
    await connectDB()
    const experience = await ExperienceModel.findByIdAndUpdate(id, data, { new: true }).lean()
    if (!experience) {
      throw new Error('Experience not found')
    }
    return {
      ...experience,
      _id: experience._id.toString(),
    } as Experience
  } catch (error: any) {
    logger.error('Update experience error:', error)
    throw error
  }
}

export async function deleteExperience(id: string): Promise<void> {
  try {
    await connectDB()
    const experience = await ExperienceModel.findByIdAndDelete(id)
    if (!experience) {
      throw new Error('Experience not found')
    }
  } catch (error: any) {
    logger.error('Delete experience error:', error)
    throw error
  }
}


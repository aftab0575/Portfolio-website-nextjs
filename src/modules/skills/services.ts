import SkillModel from './schema'
import { Skill, SkillFormData } from './types'
import connectDB from '@/services/mongodb'
import logger from '@/utils/logger'

export async function getAllSkills(activeOnly: boolean = false): Promise<Skill[]> {
  try {
    await connectDB()
    const query = activeOnly ? { isActive: true } : {}
    const skills = await SkillModel.find(query)
      .sort({ category: 1, order: 1 })
      .lean()
    return skills.map((s) => ({
      ...s,
      _id: s._id.toString(),
    })) as Skill[]
  } catch (error: any) {
    logger.error('Get all skills error:', error)
    throw error
  }
}

export async function getSkillById(id: string): Promise<Skill | null> {
  try {
    await connectDB()
    const skill = await SkillModel.findById(id).lean()
    if (!skill) return null
    return {
      ...skill,
      _id: skill._id.toString(),
    } as Skill
  } catch (error: any) {
    logger.error('Get skill by ID error:', error)
    throw error
  }
}

export async function createSkill(data: SkillFormData): Promise<Skill> {
  try {
    await connectDB()
    const skill = await SkillModel.create(data)
    return {
      ...skill.toObject(),
      _id: skill._id.toString(),
    } as Skill
  } catch (error: any) {
    logger.error('Create skill error:', error)
    throw error
  }
}

export async function updateSkill(id: string, data: Partial<SkillFormData>): Promise<Skill> {
  try {
    await connectDB()
    const skill = await SkillModel.findByIdAndUpdate(id, data, { new: true }).lean()
    if (!skill) {
      throw new Error('Skill not found')
    }
    return {
      ...skill,
      _id: skill._id.toString(),
    } as Skill
  } catch (error: any) {
    logger.error('Update skill error:', error)
    throw error
  }
}

export async function deleteSkill(id: string): Promise<void> {
  try {
    await connectDB()
    const skill = await SkillModel.findByIdAndDelete(id)
    if (!skill) {
      throw new Error('Skill not found')
    }
  } catch (error: any) {
    logger.error('Delete skill error:', error)
    throw error
  }
}

export async function updateSkillOrder(skills: { id: string; order: number }[]): Promise<void> {
  try {
    await connectDB()
    const bulkOps = skills.map((skill) => ({
      updateOne: {
        filter: { _id: skill.id as any },
        update: { $set: { order: skill.order } },
      },
    }))
    await SkillModel.bulkWrite(bulkOps as any)
  } catch (error: any) {
    logger.error('Update skill order error:', error)
    throw error
  }
}


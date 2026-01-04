import ThemeModel from './schema'
import { Theme, ThemeFormData } from './types'
import connectDB from '@/services/mongodb'
import logger from '@/utils/logger'

export async function getAllThemes(): Promise<Theme[]> {
  try {
    await connectDB()
    const themes = await ThemeModel.find().sort({ createdAt: -1 }).lean()
    return themes.map((t) => ({
      ...t,
      _id: t._id.toString(),
    })) as Theme[]
  } catch (error: any) {
    logger.error('Get all themes error:', error)
    throw error
  }
}

export async function getActiveTheme(): Promise<Theme | null> {
  try {
    await connectDB()
    const theme = await ThemeModel.findOne({ isActive: true }).lean()
    if (!theme) return null
    return {
      ...theme,
      _id: theme._id.toString(),
    } as Theme
  } catch (error: any) {
    logger.error('Get active theme error:', error)
    throw error
  }
}

export async function getThemeById(id: string): Promise<Theme | null> {
  try {
    await connectDB()
    const theme = await ThemeModel.findById(id).lean()
    if (!theme) return null
    return {
      ...theme,
      _id: theme._id.toString(),
    } as Theme
  } catch (error: any) {
    logger.error('Get theme by ID error:', error)
    throw error
  }
}

export async function createTheme(data: ThemeFormData): Promise<Theme> {
  try {
    await connectDB()
    const theme = await ThemeModel.create({
      ...data,
      isActive: false,
    })
    return {
      ...theme.toObject(),
      _id: theme._id.toString(),
    } as Theme
  } catch (error: any) {
    logger.error('Create theme error:', error)
    throw error
  }
}

export async function updateTheme(id: string, data: Partial<ThemeFormData>): Promise<Theme> {
  try {
    await connectDB()
    const theme = await ThemeModel.findByIdAndUpdate(id, data, { new: true }).lean()
    if (!theme) {
      throw new Error('Theme not found')
    }
    return {
      ...theme,
      _id: theme._id.toString(),
    } as Theme
  } catch (error: any) {
    logger.error('Update theme error:', error)
    throw error
  }
}

export async function activateTheme(id: string): Promise<Theme> {
  try {
    await connectDB()
    // Deactivate all themes first
    await ThemeModel.updateMany({}, { $set: { isActive: false } })
    // Activate the selected theme
    const theme = await ThemeModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).lean()
    if (!theme) {
      throw new Error('Theme not found')
    }
    return {
      ...theme,
      _id: theme._id.toString(),
    } as Theme
  } catch (error: any) {
    logger.error('Activate theme error:', error)
    throw error
  }
}

export async function deleteTheme(id: string): Promise<void> {
  try {
    await connectDB()
    const theme = await ThemeModel.findByIdAndDelete(id)
    if (!theme) {
      throw new Error('Theme not found')
    }
  } catch (error: any) {
    logger.error('Delete theme error:', error)
    throw error
  }
}


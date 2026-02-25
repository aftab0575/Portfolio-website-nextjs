import SiteModel from './schema'
import { Site, SiteFormData } from './types'
import connectDB from '@/services/mongodb'
import logger from '@/utils/logger'

export async function getSite(): Promise<Site | null> {
  try {
    await connectDB()
    let site = await SiteModel.findOne().lean()
    if (!site) {
      const created = await SiteModel.create({})
      site = await SiteModel.findById(created._id).lean()
    }
    if (!site) return null
    return {
      ...site,
      _id: site._id.toString(),
      updatedAt: (site.updatedAt as Date)?.toISOString?.(),
    } as Site
  } catch (error: any) {
    logger.error('Get site error:', error)
    throw error
  }
}

export async function updateSite(data: SiteFormData): Promise<Site> {
  try {
    await connectDB()
    let site = await SiteModel.findOne()
    if (!site) {
      site = await SiteModel.create({})
    }
    if (data.hero) {
      site.hero = { ...site.hero, ...data.hero }
    }
    await site.save()
    const updated = await SiteModel.findById(site._id).lean()
    if (!updated) throw new Error('Failed to fetch updated site')
    return {
      ...updated,
      _id: updated._id.toString(),
      updatedAt: updated.updatedAt?.toISOString?.(),
    } as Site
  } catch (error: any) {
    logger.error('Update site error:', error)
    throw error
  }
}

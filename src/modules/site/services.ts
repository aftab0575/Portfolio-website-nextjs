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
      site.hero = {
        imageUrl: data.hero.imageUrl ?? site.hero.imageUrl,
        imageAlt: data.hero.imageAlt ?? site.hero.imageAlt,
        publicId: data.hero.publicId ?? site.hero.publicId,
      }
    }
    if (data.aboutImage) {
      // Merge about image fields while preserving required strings
      const current = site.aboutImage || {
        imageUrl: '',
        imageAlt: 'About section image',
        publicId: undefined,
      }
      site.aboutImage = {
        imageUrl: data.aboutImage.imageUrl ?? current.imageUrl,
        imageAlt: data.aboutImage.imageAlt ?? current.imageAlt,
        publicId: data.aboutImage.publicId ?? current.publicId,
      }
    }
    if (data.cv) {
      // Merge CV fields while preserving required strings
      const currentCv = site.cv || {
        url: '',
        fileName: 'CV',
        publicId: undefined,
      }
      site.cv = {
        url: data.cv.url ?? currentCv.url,
        fileName: data.cv.fileName ?? currentCv.fileName,
        publicId: data.cv.publicId ?? currentCv.publicId,
      }
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

import mongoose, { Schema, Model } from 'mongoose'

export interface SiteDocument extends mongoose.Document {
  hero: {
    imageUrl: string
    imageAlt: string
    publicId?: string
  }
  aboutImage?: {
    imageUrl: string
    imageAlt: string
    publicId?: string
  }
  cv?: {
    url: string
    fileName?: string
    publicId?: string
  }
  updatedAt: Date
}

const SiteSchema = new Schema<SiteDocument>(
  {
    hero: {
      imageUrl: { type: String, default: '' },
      imageAlt: { type: String, default: 'Portrait artwork for hero section' },
      publicId: { type: String, default: null },
    },
    aboutImage: {
      imageUrl: { type: String, default: '' },
      imageAlt: { type: String, default: 'About section image' },
      publicId: { type: String, default: null },
    },
    cv: {
      url: { type: String, default: '' },
      fileName: { type: String, default: 'CV' },
      publicId: { type: String, default: null },
    },
  },
  { timestamps: true }
)

const SiteModel: Model<SiteDocument> =
  mongoose.models.Site || mongoose.model<SiteDocument>('Site', SiteSchema)

export default SiteModel

import mongoose, { Schema, Model } from 'mongoose'

export interface SiteDocument extends mongoose.Document {
  hero: {
    imageUrl: string
    imageAlt: string
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
  },
  { timestamps: true }
)

const SiteModel: Model<SiteDocument> =
  mongoose.models.Site || mongoose.model<SiteDocument>('Site', SiteSchema)

export default SiteModel

import mongoose, { Schema, Model } from 'mongoose'
import { Experience } from '@/types/experience'

interface ExperienceDocument extends Omit<Experience, '_id'>, mongoose.Document {}

const ExperienceSchema = new Schema<ExperienceDocument>(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    techStack: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

// Index for sorting by date
ExperienceSchema.index({ startDate: -1 })

const ExperienceModel: Model<ExperienceDocument> =
  mongoose.models.Experience || mongoose.model<ExperienceDocument>('Experience', ExperienceSchema)

export default ExperienceModel


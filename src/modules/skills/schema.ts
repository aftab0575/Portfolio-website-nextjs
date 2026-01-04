import mongoose, { Schema, Model } from 'mongoose'
import { Skill } from '@/types/skill'

interface SkillDocument extends Omit<Skill, '_id'>, mongoose.Document {}

const SkillSchema = new Schema<SkillDocument>(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    level: {
      type: Number,
      required: [true, 'Level is required'],
      min: [1, 'Level must be at least 1'],
      max: [100, 'Level must be at most 100'],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
SkillSchema.index({ category: 1, order: 1 })
SkillSchema.index({ isActive: 1 })

const SkillModel: Model<SkillDocument> =
  mongoose.models.Skill || mongoose.model<SkillDocument>('Skill', SkillSchema)

export default SkillModel


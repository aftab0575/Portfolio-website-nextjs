import mongoose, { Schema, Model } from 'mongoose'
import { Theme } from '@/types/theme'

interface ThemeDocument extends Omit<Theme, '_id'>, mongoose.Document {}

const ThemeVariablesSchema = new Schema(
  {
    primary: {
      type: String,
      required: true,
    },
    secondary: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      required: true,
    },
    foreground: {
      type: String,
      required: true,
    },
    accent: {
      type: String,
      required: true,
    },
    border: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

const ThemeSchema = new Schema<ThemeDocument>(
  {
    name: {
      type: String,
      required: [true, 'Theme name is required'],
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    variables: {
      type: ThemeVariablesSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Ensure only one active theme
ThemeSchema.pre('save', async function (next) {
  if (this.isActive && this.isModified('isActive')) {
    await mongoose.model('Theme').updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    )
  }
  next()
})

// Index for faster queries
ThemeSchema.index({ isActive: 1 })

const ThemeModel: Model<ThemeDocument> =
  mongoose.models.Theme || mongoose.model<ThemeDocument>('Theme', ThemeSchema)

export default ThemeModel


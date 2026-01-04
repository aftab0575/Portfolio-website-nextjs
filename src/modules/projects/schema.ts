import mongoose, { Schema, Model } from 'mongoose'
import { Project } from '@/types/project'
import { slugify } from '@/utils/slugify'

interface ProjectDocument extends Omit<Project, '_id'>, mongoose.Document {}

const ImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
)

const ProjectSchema = new Schema<ProjectDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    techStack: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      default: '',
    },
    liveUrl: {
      type: String,
      default: '',
    },
    images: {
      type: [ImageSchema],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    category: {
      type: String,
      enum: ['Frontend', 'Full-Stack', 'AI'],
    },
  },
  {
    timestamps: true,
  }
)

// Generate slug before saving
ProjectSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title)
  }
  next()
})

// Index for faster queries
// Note: slug index is automatically created by unique: true
ProjectSchema.index({ isFeatured: 1 })
ProjectSchema.index({ category: 1 })

const ProjectModel: Model<ProjectDocument> =
  mongoose.models.Project || mongoose.model<ProjectDocument>('Project', ProjectSchema)

export default ProjectModel


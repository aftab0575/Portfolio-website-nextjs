import mongoose, { Schema, Model } from 'mongoose'
import { ContactMessage } from '@/types/contact'

interface ContactMessageDocument extends Omit<ContactMessage, '_id'>, mongoose.Document {}

const ContactMessageSchema = new Schema<ContactMessageDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
ContactMessageSchema.index({ isRead: 1 })
ContactMessageSchema.index({ createdAt: -1 })

const ContactMessageModel: Model<ContactMessageDocument> =
  mongoose.models.ContactMessage ||
  mongoose.model<ContactMessageDocument>('ContactMessage', ContactMessageSchema)

export default ContactMessageModel


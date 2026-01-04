import mongoose, { Schema, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import { AdminUser } from '@/types/user'

interface AdminUserDocument extends Omit<AdminUser, '_id'>, mongoose.Document {
  comparePassword(candidatePassword: string): Promise<boolean>
}

const AdminUserSchema = new Schema<AdminUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
AdminUserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
AdminUserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

const AdminUserModel: Model<AdminUserDocument> =
  mongoose.models.AdminUser || mongoose.model<AdminUserDocument>('AdminUser', AdminUserSchema)

export default AdminUserModel


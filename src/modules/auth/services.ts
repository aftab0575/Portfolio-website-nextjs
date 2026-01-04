import jwt, { SignOptions } from 'jsonwebtoken'
import AdminUserModel from './schema'
import { LoginCredentials, AuthResponse } from '@/types/user'
import connectDB from '@/services/mongodb'
import logger from '@/utils/logger'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    await connectDB()

    const user = await AdminUserModel.findOne({ email: credentials.email }).select('+passwordHash')

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const isPasswordValid = await user.comparePassword(credentials.password)

    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    )

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }
  } catch (error: any) {
    logger.error('Login error:', error)
    throw error
  }
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string)
    return decoded
  } catch (error: any) {
    logger.error('Token verification error:', error)
    throw new Error('Invalid or expired token')
  }
}

export async function getUserById(userId: string) {
  try {
    await connectDB()
    const user = await AdminUserModel.findById(userId).select('-passwordHash')
    return user
  } catch (error: any) {
    logger.error('Get user error:', error)
    throw error
  }
}

export async function createAdminUser(
  name: string,
  email: string,
  password: string
): Promise<any> {
  try {
    await connectDB()

    const existingUser = await AdminUserModel.findOne({ email })
    if (existingUser) {
      throw new Error('Admin user already exists')
    }

    const user = await AdminUserModel.create({
      name,
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      role: 'admin',
    })

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }
  } catch (error: any) {
    logger.error('Create admin user error:', error)
    throw error
  }
}


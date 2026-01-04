import ContactMessageModel from './schema'
import { ContactMessage, ContactFormData } from './types'
import connectDB from '@/services/mongodb'
import logger from '@/utils/logger'

export async function getAllMessages(filters?: {
  isRead?: boolean
}): Promise<ContactMessage[]> {
  try {
    await connectDB()
    const query = filters?.isRead !== undefined ? { isRead: filters.isRead } : {}
    const messages = await ContactMessageModel.find(query)
      .sort({ createdAt: -1 })
      .lean()
    return messages.map((m) => ({
      ...m,
      _id: m._id.toString(),
    })) as ContactMessage[]
  } catch (error: any) {
    logger.error('Get all messages error:', error)
    throw error
  }
}

export async function getMessageById(id: string): Promise<ContactMessage | null> {
  try {
    await connectDB()
    const message = await ContactMessageModel.findById(id).lean()
    if (!message) return null
    return {
      ...message,
      _id: message._id.toString(),
    } as ContactMessage
  } catch (error: any) {
    logger.error('Get message by ID error:', error)
    throw error
  }
}

export async function createMessage(data: ContactFormData): Promise<ContactMessage> {
  try {
    await connectDB()
    const message = await ContactMessageModel.create({
      ...data,
      isRead: false,
    })
    return {
      ...message.toObject(),
      _id: message._id.toString(),
    } as ContactMessage
  } catch (error: any) {
    logger.error('Create message error:', error)
    throw error
  }
}

export async function markAsRead(id: string): Promise<ContactMessage> {
  try {
    await connectDB()
    const message = await ContactMessageModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    ).lean()
    if (!message) {
      throw new Error('Message not found')
    }
    return {
      ...message,
      _id: message._id.toString(),
    } as ContactMessage
  } catch (error: any) {
    logger.error('Mark as read error:', error)
    throw error
  }
}

export async function deleteMessage(id: string): Promise<void> {
  try {
    await connectDB()
    const message = await ContactMessageModel.findByIdAndDelete(id)
    if (!message) {
      throw new Error('Message not found')
    }
  } catch (error: any) {
    logger.error('Delete message error:', error)
    throw error
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    await connectDB()
    return await ContactMessageModel.countDocuments({ isRead: false })
  } catch (error: any) {
    logger.error('Get unread count error:', error)
    throw error
  }
}


export interface ContactMessage {
  _id?: string
  name: string
  email: string
  message: string
  isRead: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface ContactFormData {
  name: string
  email: string
  message: string
}


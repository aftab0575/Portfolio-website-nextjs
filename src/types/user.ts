export interface AdminUser {
  _id?: string
  name: string
  email: string
  passwordHash: string
  role: 'admin'
  createdAt?: Date
  updatedAt?: Date
}

export interface PublicUser {
  _id: string
  name: string
  email: string
  role: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: PublicUser
  token: string
}


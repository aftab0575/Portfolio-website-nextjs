import { AdminUser, PublicUser, LoginCredentials, AuthResponse } from '@/types/user'

export type { AdminUser, PublicUser, LoginCredentials, AuthResponse }

export interface AuthState {
  user: PublicUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}


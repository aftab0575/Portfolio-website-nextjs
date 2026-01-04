export interface ThemeVariables {
  primary: string
  secondary: string
  background: string
  foreground: string
  accent: string
  border: string
}

export interface Theme {
  _id?: string
  name: string
  isActive: boolean
  variables: ThemeVariables
  createdAt?: Date
  updatedAt?: Date
}

export interface ThemeFormData {
  name: string
  variables: ThemeVariables
}


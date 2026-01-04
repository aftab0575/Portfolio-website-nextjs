export interface Skill {
  _id?: string
  name: string
  category: string
  level: number // 1-5 or 1-100
  order: number
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface SkillFormData {
  name: string
  category: string
  level: number
  order: number
  isActive: boolean
}

export type SkillCategory = 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'Other'


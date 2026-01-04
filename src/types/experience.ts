export interface Experience {
  _id?: string
  company: string
  role: string
  startDate: string
  endDate: string | null
  description: string
  techStack: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ExperienceFormData {
  company: string
  role: string
  startDate: string
  endDate: string | null
  description: string
  techStack: string[]
}


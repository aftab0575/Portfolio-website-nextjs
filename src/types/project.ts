export interface Image {
  url: string
  publicId: string
  alt: string
  order: number
}

export interface Project {
  _id?: string
  title: string
  description: string
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  images: Image[]
  isFeatured: boolean
  slug: string
  category?: 'Frontend' | 'Full-Stack' | 'AI'
  createdAt?: Date
  updatedAt?: Date
}

export interface ProjectFormData {
  title: string
  description: string
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  images: Image[]
  isFeatured: boolean
  category?: 'Frontend' | 'Full-Stack' | 'AI'
}


export interface SiteHero {
  imageUrl: string
  imageAlt: string
  publicId?: string
}

export interface Site {
  _id: string
  hero: SiteHero
  updatedAt?: string
}

export interface SiteFormData {
  hero?: Partial<SiteHero>
}

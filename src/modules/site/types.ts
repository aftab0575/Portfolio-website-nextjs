export interface SiteHero {
  imageUrl: string
  imageAlt: string
  publicId?: string
}

export interface SiteAboutImage {
  imageUrl: string
  imageAlt: string
  publicId?: string
}

export interface SiteCv {
  url: string
  fileName?: string
  publicId?: string
}

export interface Site {
  _id: string
  hero: SiteHero
  aboutImage?: SiteAboutImage
  cv?: SiteCv
  updatedAt?: string
}

export interface SiteFormData {
  hero?: Partial<SiteHero>
  aboutImage?: Partial<SiteAboutImage>
  cv?: Partial<SiteCv>
}

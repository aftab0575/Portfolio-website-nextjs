export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
}

export interface ImageUploadOptions {
  folder?: string
  maxWidth?: number
  maxHeight?: number
  quality?: number
}


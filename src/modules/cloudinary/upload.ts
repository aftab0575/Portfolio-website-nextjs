import { uploadImage } from '@/services/cloudinary'
import { CloudinaryUploadResult, ImageUploadOptions } from './types'

export async function uploadImageToCloudinary(
  file: File | Buffer | string,
  options?: ImageUploadOptions
): Promise<CloudinaryUploadResult> {
  try {
    let fileData: Buffer | string

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      fileData = Buffer.from(arrayBuffer)
    } else {
      fileData = file
    }

    const result = await uploadImage(fileData, options?.folder)
    return result
  } catch (error: any) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }
}


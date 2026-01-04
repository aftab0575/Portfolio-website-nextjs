import { deleteImage } from '@/services/cloudinary'

export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    await deleteImage(publicId)
  } catch (error: any) {
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}


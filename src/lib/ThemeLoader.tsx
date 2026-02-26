import { getActiveTheme } from '@/modules/theme/services'

export async function loadActiveTheme() {
  try {
    return await getActiveTheme()
  } catch {
    return null
  }
}


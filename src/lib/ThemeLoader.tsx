import { getActiveTheme } from '@/modules/theme/services'

export async function loadActiveTheme() {
  try {
    const theme = await getActiveTheme()
    return theme
  } catch (error) {
    return null
  }
}


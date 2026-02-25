import { getActiveTheme } from '@/modules/theme/services'
import { unstable_cache } from 'next/cache'

const getCachedActiveTheme = unstable_cache(
  async () => {
    try {
      return await getActiveTheme()
    } catch {
      return null
    }
  },
  ['active-theme'],
  { revalidate: 300 },
)

export async function loadActiveTheme() {
  return getCachedActiveTheme()
}


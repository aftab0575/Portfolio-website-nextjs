import { ThemeFormData } from '@/types/theme'

export const defaultThemes: ThemeFormData[] = [
  {
    name: 'Default',
    variables: {
      primary: '#0D1B2A',
      secondary: '#2A9D8F',
      background: '#FFFFFF',
      foreground: '#1D3557',
      accent: '#E76F51',
      border: '#F1F3F5',
    },
  },
  {
    name: 'Dark Pro',
    variables: {
      primary: '#1D3557',
      secondary: '#2A9D8F',
      background: '#0D1B2A',
      foreground: '#FFFFFF',
      accent: '#F4A261',
      border: '#495057',
    },
  },
  {
    name: 'Ocean',
    variables: {
      primary: '#0ea5e9',
      secondary: '#38bdf8',
      background: '#020617',
      foreground: '#e5e7eb',
      accent: '#22d3ee',
      border: '#1e293b',
    },
  },
  {
    name: 'Emerald',
    variables: {
      primary: '#10b981',
      secondary: '#34d399',
      background: '#ffffff',
      foreground: '#1f2937',
      accent: '#059669',
      border: '#d1d5db',
    },
  },
]


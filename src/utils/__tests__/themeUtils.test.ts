import { hexToHsl, isLightColor, getForegroundColor, getMutedColors } from '../themeUtils'

describe('themeUtils', () => {
  describe('hexToHsl', () => {
    it('should convert hex colors to HSL format', () => {
      expect(hexToHsl('#0D1B2A')).toBe('210 100% 12%')
      expect(hexToHsl('#FFFFFF')).toBe('0 0% 100%')
      expect(hexToHsl('#000000')).toBe('0 0% 0%')
      expect(hexToHsl('#FF0000')).toBe('0 100% 50%')
    })

    it('should handle hex colors without hash', () => {
      expect(hexToHsl('0D1B2A')).toBe('210 100% 12%')
    })
  })

  describe('isLightColor', () => {
    it('should correctly identify light colors', () => {
      expect(isLightColor('#FFFFFF')).toBe(true)
      expect(isLightColor('#F0F0F0')).toBe(true)
      expect(isLightColor('#CCCCCC')).toBe(true)
    })

    it('should correctly identify dark colors', () => {
      expect(isLightColor('#000000')).toBe(false)
      expect(isLightColor('#0D1B2A')).toBe(false)
      expect(isLightColor('#333333')).toBe(false)
    })
  })

  describe('getForegroundColor', () => {
    it('should return dark foreground for light backgrounds', () => {
      expect(getForegroundColor('#FFFFFF')).toBe('0 0% 9%')
      expect(getForegroundColor('#F0F0F0')).toBe('0 0% 9%')
    })

    it('should return light foreground for dark backgrounds', () => {
      expect(getForegroundColor('#000000')).toBe('0 0% 98%')
      expect(getForegroundColor('#0D1B2A')).toBe('0 0% 98%')
    })
  })

  describe('getMutedColors', () => {
    it('should return light muted colors for light backgrounds', () => {
      const result = getMutedColors('#FFFFFF')
      expect(result.muted).toBe('0 0% 96.1%')
      expect(result.mutedForeground).toBe('0 0% 45.1%')
    })

    it('should return dark muted colors for dark backgrounds', () => {
      const result = getMutedColors('#000000')
      expect(result.muted).toBe('0 0% 14.9%')
      expect(result.mutedForeground).toBe('0 0% 63.9%')
    })
  })
})
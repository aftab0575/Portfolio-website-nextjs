'use client'

import TypingText from '@/components/ui/typing-text'

const taglinePhrases = [
  'Building exceptional digital experiences with modern technologies',
  'Creating powerful web applications with cutting-edge frameworks',
  'Integrating AI and machine learning into innovative solutions',
  'Deploying scalable applications to the cloud',
  'Delivering end-to-end full-stack solutions',
]
const taglineColors = [
  'hsl(var(--primary))',
  'hsl(var(--foreground))',
  'hsl(var(--muted-foreground))',
  'hsl(var(--accent))',
  'hsl(var(--primary))',
]

export default function HeroTagline() {
  return (
    <TypingText
      as="span"
      text={taglinePhrases}
      textColors={taglineColors}
      typingSpeed={45}
      deletingSpeed={25}
      pauseDuration={1600}
      showCursor
      startOnVisible={false}
      className="inline"
    />
  )
}

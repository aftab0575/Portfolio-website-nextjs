'use client'

import dynamic from 'next/dynamic'
import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import ServicesSection from '@/components/home/ServicesSection'

function SectionSkeleton({ className }: { className: string }) {
  return (
    <section className={className} aria-hidden="true">
      <div className="container mx-auto px-4">
        <div className="h-64 rounded-xl bg-muted/40 animate-pulse" />
      </div>
    </section>
  )
}

const SkillsSection = dynamic(() => import('@/components/home/SkillsSection'), {
  ssr: false,
  loading: () => <SectionSkeleton className="py-20 bg-background" />,
})

const FeaturedProjectsSection = dynamic(
  () => import('@/components/home/FeaturedProjectsSection'),
  {
    ssr: false,
    loading: () => <SectionSkeleton className="py-20 bg-muted/30" />,
  },
)

const ExperienceSection = dynamic(() => import('@/components/home/ExperienceSection'), {
  ssr: false,
  loading: () => <SectionSkeleton className="py-20 bg-background" />,
})

const TestimonialsSection = dynamic(
  () => import('@/components/home/TestimonialsSection'),
  {
    ssr: false,
    loading: () => <SectionSkeleton className="py-20 bg-background" />,
  },
)

const ContactSection = dynamic(() => import('@/components/home/ContactSection'), {
  ssr: false,
  loading: () => <SectionSkeleton className="py-20 bg-muted/30" />,
})

export default function HomeClient() {
  return (
    <main className="overflow-visible">
      <HeroSection />
      <SkillsSection />
      <AboutSection />
      <FeaturedProjectsSection />
      <ExperienceSection />
      <TestimonialsSection />
      <ServicesSection />
      <ContactSection />
    </main>
  )
}


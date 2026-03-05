'use client'

import { memo, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { portfolioData } from '@/constants/portfolioData'
import { routes } from '@/constants/routes'

const aboutCards = [
  {
    number: '01',
    title: 'Experience',
    body: portfolioData.about.fullBio,
  },
  {
    number: '02',
    title: 'Journey',
    body: portfolioData.about.story,
  },
  {
    number: '03',
    title: 'Approach',
    body: portfolioData.about.approach,
  },
] as const

const AboutSection = memo(function AboutSection() {
  const [aboutImage, setAboutImage] = useState<{ url: string; alt: string } | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadSite = async () => {
      try {
        const res = await fetch('/api/site', { cache: 'no-store' })
        const json = await res.json()
        if (cancelled) return
        if (json?.success && json?.data?.aboutImage?.imageUrl) {
          setAboutImage({
            url: json.data.aboutImage.imageUrl,
            alt: json.data.aboutImage.imageAlt || portfolioData.hero.imageAlt,
          })
        }
      } catch {
        // Ignore and fall back to static image
      }
    }

    void loadSite()

    return () => {
      cancelled = true
    }
  }, [])

  const heroImageUrl = aboutImage?.url
  const heroImageAlt = aboutImage?.alt ?? 'About section image'

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Top: image + text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-14">
            {/* Left: circular image */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div
                className="relative w-56 sm:w-64 lg:w-72"
                style={{ aspectRatio: '5 / 7' }}
              >
                {heroImageUrl ? (
                  <>
                    <Image
                      src={heroImageUrl}
                      alt={heroImageAlt}
                      fill
                      className="object-contain object-top rounded-[2rem]"
                      sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
                      priority={false}
                    />
                    {/* Bottom fade to background to blend image */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-[2rem] bg-gradient-to-b from-transparent via-background/80 to-background" />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-transparent rounded-[2rem]">
                    <span className="text-5xl" aria-hidden="true">
                      🙂
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right: heading + copy + CTA */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-5 text-left"
            >
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary">
                About Me
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Crafting modern web experiences with a user-first mindset.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                {portfolioData.about.short}
              </p>
              <div className="pt-2">
                <Link href={routes.sections.projects}>
                  <Button
                    size="lg"
                    className="rounded-full px-8"
                  >
                    View Projects
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Bottom: three numbered cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aboutCards.map((card) => (
                <Card
                  key={card.number}
                  className="h-full border-border/60 bg-card/95 shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
                >
                  <CardContent className="p-6 sm:p-7 flex flex-col h-full">
                    <div className="mb-4 flex items-baseline gap-3">
                      <span className="text-3xl font-extrabold tracking-tight text-primary">
                        {card.number}
                      </span>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                        {card.title}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {card.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
})

export default AboutSection


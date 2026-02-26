'use client'

import { useEffect, useState, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/constants/site'
import { Github, Linkedin, Twitter } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { portfolioData } from '@/constants/portfolioData'
import SplitText from '@/components/SplitText'

// Colorful floating dots for hero background (sizes in px, theme-aware colors)
const heroDots = [
  { size: 14, x: '10%', y: '20%', colorVar: '--primary', duration: 10, delay: 0, moveX: 40, moveY: -60 },
  { size: 20, x: '85%', y: '15%', colorVar: '--secondary', duration: 14, delay: 1, moveX: -35, moveY: 50 },
  { size: 10, x: '25%', y: '70%', colorVar: '--accent', duration: 12, delay: 2, moveX: 45, moveY: -40 },
  { size: 18, x: '70%', y: '80%', colorVar: '--primary', duration: 16, delay: 0.5, moveX: -50, moveY: -30 },
  { size: 12, x: '50%', y: '40%', colorVar: '--secondary', duration: 11, delay: 3, moveX: 30, moveY: 55 },
  { size: 22, x: '15%', y: '50%', colorVar: '--accent', duration: 13, delay: 1.5, moveX: -40, moveY: 45 },
  { size: 10, x: '90%', y: '60%', colorVar: '--primary', duration: 15, delay: 2.5, moveX: 35, moveY: -50 },
  { size: 16, x: '40%', y: '85%', colorVar: '--secondary', duration: 9, delay: 0.8, moveX: -45, moveY: 35 },
] as const

const HeroSection = memo(function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  const [hasMounted, setHasMounted] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [heroImage, setHeroImage] = useState<{ url: string; alt: string } | null>(null)
  const heroName = portfolioData.hero.name
  const afterNameDelay = shouldReduceMotion ? 0.05 : 0.3

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateMobile = () => setIsMobileViewport(mediaQuery.matches)
    updateMobile()
    mediaQuery.addEventListener('change', updateMobile)
    return () => mediaQuery.removeEventListener('change', updateMobile)
  }, [])

  useEffect(() => {
    let cancelled = false

    const fallbackHero = {
      url: portfolioData.hero.imageUrl,
      alt: portfolioData.hero.imageAlt,
    }

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const loadHeroImage = async () => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await fetch('/api/site', { cache: 'no-store' })
          const res = await response.json()
          if (cancelled) return

          if (res?.success && res?.data?.hero?.imageUrl) {
            setHeroImage({
              url: res.data.hero.imageUrl,
              alt: res.data.hero.imageAlt || portfolioData.hero.imageAlt,
            })
            return
          }
          break
        } catch {
          if (attempt < 2) {
            await wait(350 * (attempt + 1))
          }
        }
      }

      if (!cancelled) {
        setHeroImage(fallbackHero)
      }
    }

    void loadHeroImage()

    return () => {
      cancelled = true
    }
  }, [])

  const dotsToRender = isMobileViewport ? heroDots.slice(0, 5) : heroDots
  const displayHeroImage = heroImage?.url ?? portfolioData.hero.imageUrl
  const displayHeroAlt = heroImage?.alt ?? portfolioData.hero.imageAlt

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden hero-aurora-bg -mt-[5.5rem] md:-mt-[6rem] pt-[5.5rem] md:pt-[6rem]"
    >
      {/* Animated aurora blur layer */}
      <motion.div
        className="hero-aurora-blur"
        aria-hidden="true"
        style={{ transformOrigin: 'center center' }}
        animate={
          shouldReduceMotion || !hasMounted
            ? {}
            : {
                x: [0, 80, -60, 0],
                y: [0, -60, 80, 0],
                scale: [1, 1.2, 0.9, 1],
              }
        }
        transition={
          shouldReduceMotion || !hasMounted
            ? { duration: 0 }
            : {
                duration: 25,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      />

      {/* Colorful floating dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {dotsToRender.map((dot, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: dot.x,
              top: dot.y,
              transform: 'translate(-50%, -50%)',
              width: dot.size,
              height: dot.size,
              willChange:
                shouldReduceMotion || !hasMounted ? 'auto' : ('transform, opacity' as const),
            }}
            initial={{ opacity: 0.2, x: 0, y: 0, scale: 0.8 }}
            animate={
              shouldReduceMotion || !hasMounted
                ? { opacity: 0.4, scale: 1 }
                : {
                    x: [0, dot.moveX, -dot.moveX * 0.6, 0],
                    y: [0, dot.moveY, -dot.moveY * 0.6, 0],
                    scale: [0.9, 1.4, 0.95, 0.9],
                    opacity: [0.4, 0.92, 0.5, 0.4],
                  }
            }
            transition={
              shouldReduceMotion || !hasMounted
                ? { duration: 0 }
                : {
                    duration: dot.duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: dot.delay,
                  }
            }
          >
            <div
              className="rounded-full w-full h-full"
              aria-hidden="true"
              style={{
                width: dot.size,
                height: dot.size,
                background: `radial-gradient(circle at 30% 30%, hsl(var(${dot.colorVar}) / 0.9), hsl(var(${dot.colorVar}) / 0.4))`,
                boxShadow: `
                  0 0 ${dot.size * 3}px hsl(var(${dot.colorVar}) / 0.9),
                  0 0 ${dot.size * 6}px hsl(var(${dot.colorVar}) / 0.6)
                `,
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" aria-hidden="true" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col items-center text-center">
            <div className="flex w-full flex-col items-center">
              <h1 className="m-0 w-full">
                <span className="sr-only">{heroName}</span>
                <div
                  className="relative z-0 mx-auto w-full max-w-4xl"
                  aria-hidden="true"
                >
                  {shouldReduceMotion ? (
                    <span
                      className="block w-full text-center text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl [font-family:var(--font-figtree),Figtree,sans-serif]"
                      aria-hidden="true"
                    >
                      {heroName}
                    </span>
                  ) : (
                    <SplitText
                      text={heroName}
                      className="block w-full text-center text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl [font-family:var(--font-figtree),Figtree,sans-serif]"
                      delay={45}
                      duration={1.1}
                      ease="power3.out"
                      splitType="chars"
                      from={{ opacity: 0, y: 36 }}
                      to={{ opacity: 1, y: 0 }}
                      threshold={0.1}
                      rootMargin="-80px"
                      textAlign="center"
                      tag="span"
                      immediate
                      onLetterAnimationComplete={() => {}}
                    />
                  )}
                </div>
              </h1>
              <motion.p
                className="mt-3 text-xl font-medium text-muted-foreground sm:mt-4 sm:text-2xl lg:mt-5 lg:text-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0.25 : 0.45,
                  delay: afterNameDelay,
                }}
              >
                {portfolioData.hero.role}
              </motion.p>
            </div>
            <motion.p
              className="mt-2 max-w-2xl text-lg leading-relaxed text-muted-foreground/80 sm:mt-3 sm:text-xl lg:max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.25 : 0.45,
                delay: afterNameDelay + 0.08,
              }}
            >
              {portfolioData.hero.tagline}
            </motion.p>
            <motion.div
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.25 : 0.45,
                delay: afterNameDelay + 0.16,
              }}
            >
              {portfolioData.hero.ctaButtons.map((button, index) => (
                <Link key={index} href={button.href}>
                  <Button size="lg" variant={button.variant} className="h-12 min-w-[180px]">
                    {button.icon && <button.icon className="mr-2 h-4 w-4" />}
                    {button.text}
                  </Button>
                </Link>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="mt-12 flex justify-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: shouldReduceMotion ? 0.25 : 0.45,
                delay: afterNameDelay + 0.24,
              }}
            >
              <Link
                href={siteConfig.social.github}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Github className="h-6 w-6" />
              </Link>
              <Link
                href={siteConfig.social.linkedin}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link
                href={siteConfig.social.twitter}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Twitter className="h-6 w-6" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.25 : 0.55,
              delay: afterNameDelay + 0.12,
            }}
          >
            <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden border-none outline-none ring-0 shadow-none lg:max-w-[32rem] [&_img]:outline-none">
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage:
                    'radial-gradient(ellipse 100% 110% at 52% 48%, black 15%, black 38%, transparent 65%)',
                  maskImage:
                    'radial-gradient(ellipse 100% 110% at 52% 48%, black 15%, black 38%, transparent 65%)',
                }}
              >
                <Image
                  src={displayHeroImage}
                  alt={displayHeroAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover object-center"
                />
              </div>
              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background:
                    'radial-gradient(ellipse 120% 130% at 50% 50%, transparent 30%, hsl(var(--background) / 0.3) 55%, hsl(var(--background)) 80%)',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
})

export default HeroSection


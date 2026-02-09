'use client'

import { useEffect, useRef, memo, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { siteConfig } from '@/constants/site'
import { routes } from '@/constants/routes'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProjects } from '@/store/slices/projectsSlice'
import { fetchExperiences, selectShouldFetchExperiences } from '@/store/slices/experienceSlice'
import { 
  selectProjectsForHomePage, 
  selectProjectsLoading, 
  selectProjectsError,
  selectShouldFetchProjects 
} from '@/store/selectors'
import Loader from '@/components/common/Loader'
import ProjectCard from '@/components/common/ProjectCard'
import useRenderCount from '@/hooks/useRenderCount'
import apiClient from '@/services/apiClient'
import { useToast } from '@/hooks/useToast'
import { formatDateRange } from '@/utils/formatDate'
import { computedColorToHex } from '@/lib/utils'
import { 
  Download, 
  ExternalLink, 
  Mail, 
  MapPin, 
  Calendar,
  Code,
  Database,
  Server,
  Cloud,
  Brain,
  ChevronRight,
  Github,
  Linkedin,
  Twitter,
  Award,
  Users,
  Coffee,
  Phone,
  Send
} from 'lucide-react'
import StackedCarousel, { CarouselItem } from '@/components/ui/stacked-carousel'
import { motion, useReducedMotion } from 'framer-motion'

const TextTrail = dynamic(() => import('@/components/ui/text-trail'), { ssr: false })
const HeroTagline = dynamic(
  () => import('@/components/hero-tagline'),
  { ssr: false, loading: () => <span className="inline">Building exceptional digital experiences with modern technologies</span> },
)

// Portfolio data - ready for CMS integration
const portfolioData = {
  hero: {
    name: siteConfig.name,
    role: siteConfig.role,
    tagline: "Building exceptional digital experiences with modern technologies",
    bio: siteConfig.bio,
    resumeUrl: "/resume.pdf", // Update with actual resume URL
    ctaButtons: [
      { text: "View Projects", href: routes.sections.projects, variant: "default" as const },
      { text: "Download Resume", href: "/resume.pdf", variant: "outline" as const, icon: Download }
    ]
  },
  skills: {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "Angular"],
    backend: ["Node.js", "Express", "Python", "Django", "PHP", "Laravel"],
    database: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase"],
    devops: ["Docker", "AWS", "Vercel", "GitHub Actions", "Nginx"],
    ai: ["OpenAI API", "LangChain", "TensorFlow", "Machine Learning", "NLP"],
    // Carousel data for interactive skills showcase
    carouselData: [
      {
        id: 'frontend',
        title: 'Frontend Development',
        subtitle: 'Modern UI/UX with React & Next.js',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&crop=center',
        description: 'Building responsive, accessible, and performant user interfaces with React, Next.js, TypeScript, and Tailwind CSS.'
      },
      {
        id: 'backend',
        title: 'Backend Development',
        subtitle: 'Scalable APIs & Server Architecture',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center',
        description: 'Creating robust server-side applications with Node.js, Express, Python, and cloud-native architectures.'
      },
      {
        id: 'database',
        title: 'Database Design',
        subtitle: 'Data Modeling & Optimization',
        image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop&crop=center',
        description: 'Designing efficient database schemas with MongoDB, PostgreSQL, and implementing caching strategies.'
      },
      {
        id: 'devops',
        title: 'DevOps & Cloud',
        subtitle: 'CI/CD & Infrastructure as Code',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center',
        description: 'Automating deployments with Docker, AWS, GitHub Actions, and monitoring production systems.'
      },
      {
        id: 'mobile',
        title: 'Mobile Development',
        subtitle: 'Cross-Platform Apps',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center',
        description: 'Building native and cross-platform mobile applications with React Native and Flutter.'
      },
      {
        id: 'ai',
        title: 'AI & Machine Learning',
        subtitle: 'Intelligent Solutions',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=center',
        description: 'Integrating AI capabilities with OpenAI API, LangChain, and building intelligent web applications.'
      }
    ] as CarouselItem[]
  },
  about: {
    short: "Passionate full-stack developer with 5+ years of experience creating scalable web applications. I specialize in modern JavaScript frameworks and cloud technologies, with a focus on user experience and performance optimization.",
    fullBio: "I'm a dedicated full-stack developer who loves turning complex problems into simple, beautiful solutions. With expertise spanning from frontend frameworks to cloud infrastructure, I help businesses build robust digital products that scale.",
    story: "My development journey began during college when I built my first website for a local business. Since then, I've worked with startups, agencies, and enterprises, helping them transform ideas into scalable web applications.",
    approach: "I approach every project with a user-first mindset, focusing on performance, accessibility, and scalability. Whether it's a simple landing page or a complex web application, I ensure the end product provides an exceptional user experience.",
    stats: [
      { icon: Code, label: "Projects Completed", value: "50+" },
      { icon: Users, label: "Happy Clients", value: "30+" },
      { icon: Coffee, label: "Cups of Coffee", value: "1000+" },
      { icon: Award, label: "Years Experience", value: "5+" }
    ],
    values: [
      {
        title: "Quality First",
        description: "I believe in delivering high-quality code that is maintainable, scalable, and follows best practices.",
        icon: Award
      },
      {
        title: "Continuous Learning",
        description: "Technology evolves rapidly, and I'm committed to staying current with the latest trends and tools.",
        icon: Brain
      },
      {
        title: "Collaboration",
        description: "Great products are built by great teams. I value open communication and collaborative problem-solving.",
        icon: Users
      },
      {
        title: "User-Centric",
        description: "Every line of code I write is with the end user in mind, ensuring the best possible experience.",
        icon: Code
      }
    ]
  },
  experience: [
    {
      id: 1,
      title: "Senior Full-Stack Developer",
      company: "Tech Solutions Inc.",
      period: "2022 - Present",
      description: "Leading development of enterprise web applications using React, Node.js, and AWS."
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "Digital Agency",
      period: "2020 - 2022",
      description: "Built responsive web applications and improved user experience for 20+ clients."
    },
    {
      id: 3,
      title: "Junior Developer",
      company: "StartupCo",
      period: "2019 - 2020",
      description: "Developed features for SaaS platform using Vue.js and Python Django."
    }
  ],
  services: [
    {
      title: "Web Development",
      description: "Custom web applications built with modern frameworks and best practices.",
      icon: Code
    },
    {
      title: "API Development",
      description: "RESTful APIs and GraphQL services for scalable backend solutions.",
      icon: Server
    },
    {
      title: "Cloud Solutions",
      description: "AWS and cloud infrastructure setup for reliable, scalable applications.",
      icon: Cloud
    },
    {
      title: "AI Integration",
      description: "Implementing AI and machine learning features into web applications.",
      icon: Brain
    }
  ],
  testimonials: [
    {
      id: 'client1',
      title: 'Sarah Johnson',
      subtitle: 'CEO, TechStart Inc.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      description: '"Exceptional work quality and attention to detail. Delivered our project ahead of schedule with outstanding results. The level of professionalism and technical expertise exceeded our expectations."'
    },
    {
      id: 'client2',
      title: 'Michael Chen',
      subtitle: 'CTO, Digital Solutions',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      description: '"Professional, reliable, and technically excellent. The best developer we\'ve worked with for our enterprise solutions. Transformed our complex requirements into elegant, scalable code."'
    },
    {
      id: 'client3',
      title: 'Emily Rodriguez',
      subtitle: 'Product Manager, InnovateCorp',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      description: '"Transformed our vision into reality with clean code and beautiful design. Highly recommend for any project requiring both technical skill and creative problem-solving."'
    },
    {
      id: 'client4',
      title: 'David Kim',
      subtitle: 'Founder, StartupLab',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      description: '"Outstanding developer who understands both the technical and business aspects of projects. Delivered a robust platform that scaled perfectly with our growth."'
    }
  ] as CarouselItem[]
}

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
  { size: 14, x: '60%', y: '25%', colorVar: '--accent', duration: 17, delay: 1.2, moveX: 50, moveY: 40 },
  { size: 20, x: '30%', y: '35%', colorVar: '--primary', duration: 11, delay: 2, moveX: -30, moveY: -55 },
  { size: 10, x: '75%', y: '45%', colorVar: '--secondary', duration: 10, delay: 3.5, moveX: 40, moveY: 50 },
  { size: 18, x: '5%', y: '90%', colorVar: '--accent', duration: 12, delay: 0.3, moveX: 55, moveY: -35 },
  { size: 12, x: '95%', y: '30%', colorVar: '--primary', duration: 10, delay: 2.2, moveX: -40, moveY: 45 },
  { size: 10, x: '55%', y: '65%', colorVar: '--secondary', duration: 14, delay: 1.8, moveX: 35, moveY: -45 },
  { size: 20, x: '20%', y: '10%', colorVar: '--accent', duration: 15, delay: 0.7, moveX: -50, moveY: 40 },
]

// Persist across Strict Mode remounts so we don't flash placeholder after trail has been shown once
let clientHasMountedOnce = false

// Hero Section Component
const HeroSection = memo(function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  const [hasMounted, setHasMounted] = useState(clientHasMountedOnce)
  const [taglineMounted, setTaglineMounted] = useState(false)
  const [trailTextColor, setTrailTextColor] = useState('#18181b')
  const themeColorRef = useRef<HTMLSpanElement>(null)
  const activeThemeId = useAppSelector((state) => state.theme.activeTheme?._id) ?? null
  const heroName = portfolioData.hero.name
  const afterNameDelay = shouldReduceMotion ? 0.05 : 0.3

  useEffect(() => {
    if (!clientHasMountedOnce) {
      clientHasMountedOnce = true
      setHasMounted(true)
    }
    const id = setTimeout(() => {
      setTaglineMounted(true)
    }, 100)
    return () => clearTimeout(id)
  }, [])

  const readThemeColor = () => {
    if (themeColorRef.current) {
      const color = getComputedStyle(themeColorRef.current).getPropertyValue('color')
      setTrailTextColor(computedColorToHex(color))
    }
  }

  useEffect(() => {
    if (!hasMounted) return
    const id = requestAnimationFrame(readThemeColor)
    return () => cancelAnimationFrame(id)
  }, [hasMounted])

  useEffect(() => {
    if (!hasMounted) return
    const id = requestAnimationFrame(readThemeColor)
    return () => cancelAnimationFrame(id)
  }, [activeThemeId])

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden hero-aurora-bg -mt-[5.5rem] md:-mt-[6rem] pt-[5.5rem] md:pt-[6rem]">
      {/* Animated aurora blur layer */}
      <motion.div
        className="hero-aurora-blur"
        aria-hidden="true"
        style={{ transformOrigin: 'center center' }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, 80, -60, 0],
                y: [0, -60, 80, 0],
                scale: [1, 1.2, 0.9, 1],
              }
        }
        transition={
          shouldReduceMotion
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
        {heroDots.map((dot, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: dot.x,
              top: dot.y,
              transform: 'translate(-50%, -50%)',
              width: dot.size,
              height: dot.size,
              willChange: 'transform, opacity',
            }}
            initial={{ opacity: 0.2, x: 0, y: 0, scale: 0.8 }}
            animate={{
              x: [0, dot.moveX, -dot.moveX * 0.6, 0],
              y: [0, dot.moveY, -dot.moveY * 0.6, 0],
              scale: [0.9, 1.4, 0.95, 0.9],
              opacity: [0.4, 0.92, 0.5, 0.4],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: dot.delay,
            }}
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
                  0 0 ${dot.size * 6}px hsl(var(${dot.colorVar}) / 0.6),
                  0 0 ${dot.size * 10}px hsl(var(${dot.colorVar}) / 0.4),
                  inset 0 0 ${dot.size}px hsl(var(${dot.colorVar}) / 0.3)
                `,
              }}
            />
          </motion.div>
        ))}
      </div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" aria-hidden="true" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <span ref={themeColorRef} className="text-primary absolute opacity-0 pointer-events-none" aria-hidden />
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-0 mb-6">
            <div className="flex flex-col items-center gap-0 w-full">
              <h1 className="w-full m-0">
                <span className="sr-only">{heroName}</span>
                <div
                  className="relative z-0 mx-auto w-full max-w-4xl h-40 sm:h-48 lg:h-56 overflow-hidden rounded-lg isolate"
                  aria-hidden="true"
                >
                  {!hasMounted ? (
                    <span
                      className="block w-full h-full text-4xl sm:text-6xl lg:text-7xl font-bold opacity-0"
                      style={{ fontFamily: 'Figtree' }}
                      aria-hidden="true"
                    >
                      {heroName}
                    </span>
                  ) : (
                    <motion.div
                      className="w-full h-full"
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0.2 }
                          : { duration: 0.6, ease: 'easeOut' }
                      }
                    >
                  <TextTrail
                    text={heroName}
                    fontFamily="Figtree"
                    fontWeight="900"
                    noiseFactor={0.4}
                    noiseScale={0.0002}
                    rgbPersistFactor={0.94}
                    alphaPersistFactor={0.82}
                    animateColor={false}
                    startColor={trailTextColor}
                    textColor={trailTextColor}
                    textScale={1.55}
                  />
                    </motion.div>
                  )}
                </div>
              </h1>
              <motion.p
                className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium -mt-6 sm:-mt-8 lg:-mt-10"
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
              className="text-lg sm:text-xl text-muted-foreground/80 max-w-2xl leading-relaxed mt-0.5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.25 : 0.45,
                delay: afterNameDelay + 0.08,
              }}
            >
              {!taglineMounted
                ? portfolioData.hero.tagline
                : <HeroTagline />}
            </motion.p>
          </div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.25 : 0.45,
              delay: afterNameDelay + 0.16,
            }}
          >
            {portfolioData.hero.ctaButtons.map((button, index) => (
              <Link key={index} href={button.href}>
                <Button size="lg" variant={button.variant} className="min-w-[180px] h-12">
                  {button.icon && <button.icon className="w-4 h-4 mr-2" />}
                  {button.text}
                </Button>
              </Link>
            ))}
          </motion.div>
          
          {/* Social Links */}
          <motion.div
            className="flex justify-center gap-6 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.25 : 0.45,
              delay: afterNameDelay + 0.24,
            }}
          >
            <Link href={siteConfig.social.github} className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-6 h-6" />
            </Link>
            <Link href={siteConfig.social.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="w-6 h-6" />
            </Link>
            <Link href={siteConfig.social.twitter} className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
})

// Skills Section Component with Stacked Carousel
const SkillsSection = memo(function SkillsSection() {
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel')
  
  const skillCategories = [
    { title: "Frontend", icon: Code, skills: portfolioData.skills.frontend },
    { title: "Backend", icon: Server, skills: portfolioData.skills.backend },
    { title: "Database", icon: Database, skills: portfolioData.skills.database },
    { title: "DevOps", icon: Cloud, skills: portfolioData.skills.devops },
    { title: "AI/ML", icon: Brain, skills: portfolioData.skills.ai }
  ]

  const handleSkillClick = (skill: CarouselItem) => {
    console.log('Skill clicked:', skill.title)
    // Add navigation logic here, e.g., router.push(`/skills/${skill.id}`)
  }

  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Skills & Technologies</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore my technical expertise across different domains of software development
          </p>
          
          {/* View Mode Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={viewMode === 'carousel' ? 'default' : 'outline'}
              onClick={() => setViewMode('carousel')}
              size="sm"
            >
              Interactive View
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              size="sm"
            >
              Grid View
            </Button>
          </div>
        </motion.div>
        
        {viewMode === 'carousel' ? (
          <>
            {/* Stacked Carousel */}
            <StackedCarousel
              items={portfolioData.skills.carouselData}
              autoPlay={true}
              autoPlayInterval={6000}
              onItemClick={handleSkillClick}
              className="mb-8"
            />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Click cards to explore • Use arrow keys to navigate • Auto-play enabled
              </p>
              <Link href={routes.sections.projects}>
                <Button variant="outline">
                  See Projects
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          /* Traditional Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {skillCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <category.icon className="w-6 h-6 text-primary mr-3" />
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                  </div>
                  <div className="space-y-2">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="text-sm text-muted-foreground bg-background px-3 py-1 rounded-full">
                        {skill}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
})

// About Section Component
const AboutSection = memo(function AboutSection() {
  const [showFullBio, setShowFullBio] = useState(false)

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn more about my journey, values, and what drives me as a developer.
            </p>
          </motion.div>

          <div className="mb-10">
            <Card>
              <CardContent className="p-8">
                <div className="text-lg text-muted-foreground leading-relaxed">
                  <p className="mb-4">{portfolioData.about.short}</p>
                  {showFullBio && (
                    <>
                      <p className="mb-4">{portfolioData.about.fullBio}</p>
                      <p className="mb-4">{portfolioData.about.story}</p>
                      <p>{portfolioData.about.approach}</p>
                    </>
                  )}
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="text-primary hover:text-primary/80"
                  >
                    {showFullBio ? 'Read Less' : 'Read More'}
                    <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showFullBio ? 'rotate-90' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {portfolioData.about.stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Values */}
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8">My Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioData.about.values.map((value, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold mb-2">{value.title}</h4>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

// Featured Projects Section with Stacked Carousel
const FeaturedProjectsSection = memo(function FeaturedProjectsSection({
  projects,
  isLoading
}: {
  projects: any[]
  isLoading: boolean
}) {
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel')
  
  // Convert projects to carousel format
  const projectCarouselData: CarouselItem[] = useMemo(() => 
    projects.slice(0, 4).map((project) => ({
      id: project._id,
      title: project.title,
      subtitle: project.techStack?.slice(0, 3).join(' • ') || 'Featured Project',
      image: project.images?.[0]?.url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      description: project.description
    })), 
    [projects]
  )

  const projectCards = useMemo(() => 
    projects.slice(0, 3).map((project) => (
      <ProjectCard
        key={project._id}
        project={project}
        buttonText="View Project"
        showTechStack={true}
        maxTechStack={3}
      />
    )), 
    [projects]
  )

  const handleProjectClick = (project: CarouselItem) => {
    console.log('Project clicked:', project.title)
    // Navigate to project detail page
    // router.push(`/projects/${project.id}`)
  }

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            A showcase of my recent work and technical expertise
          </p>
          
          {/* View Mode Toggle */}
          {projects.length > 0 && (
            <div className="flex justify-center gap-2 mb-8">
              <Button
                variant={viewMode === 'carousel' ? 'default' : 'outline'}
                onClick={() => setViewMode('carousel')}
                size="sm"
              >
                Showcase View
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                size="sm"
              >
                Grid View
              </Button>
            </div>
          )}
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : projects.length > 0 ? (
          <>
            {viewMode === 'carousel' && projectCarouselData.length > 0 ? (
              <>
                {/* Stacked Carousel for Projects */}
                <StackedCarousel
                  items={projectCarouselData}
                  autoPlay={true}
                  autoPlayInterval={8000}
                  onItemClick={handleProjectClick}
                  className="mb-8"
                />
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Click projects to view details • Interactive showcase of featured work
                  </p>
                </div>
              </>
            ) : (
              /* Traditional Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {projectCards}
              </div>
            )}
            
            <div className="text-center">
              <Link href={routes.sections.contact}>
                <Button size="lg" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Me
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured projects available yet.</p>
          </div>
        )}
      </div>
    </section>
  )
})

// Experience Timeline Component
const ExperienceSection = memo(function ExperienceSection() {
  const dispatch = useAppDispatch()
  const { experiences, isLoading, error } = useAppSelector((state) => state.experience)
  const shouldFetch = useAppSelector(selectShouldFetchExperiences)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (shouldFetch && !hasFetched.current && !isLoading && !error) {
      hasFetched.current = true
      dispatch(fetchExperiences())
    }
  }, [dispatch, shouldFetch, isLoading, error])

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Experience</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My professional journey and key milestones
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No experience available yet.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-border"></div>

              {experiences.map((exp, index) => (
                <div
                  key={exp._id || `${exp.company}-${exp.role}-${exp.startDate}`}
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-3 h-3 bg-primary rounded-full border-4 border-background z-10"></div>

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-2">
                          <Calendar className="w-4 h-4 text-primary mr-2" />
                          <span className="text-sm text-muted-foreground">
                            {formatDateRange(exp.startDate, exp.endDate)}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-1">{exp.role}</h3>
                        <p className="text-primary font-medium mb-3">{exp.company}</p>
                        {exp.description && (
                          <div className="text-muted-foreground mb-4">
                            {exp.description.split('\n').filter(line => line.trim().startsWith('-')).length > 0 ? (
                              <ul className="list-disc list-inside space-y-1">
                                {exp.description.split('\n')
                                  .filter(line => line.trim().startsWith('-'))
                                  .map((line, idx) => (
                                    <li key={idx} className="pl-2">
                                      {line.trim().replace(/^-/, '').trim()}
                                    </li>
                                  ))}
                              </ul>
                            ) : (
                              <p>{exp.description}</p>
                            )}
                          </div>
                        )}
                        {exp.techStack?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {exp.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="px-3 py-1 text-sm bg-muted rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
})

// Testimonials Section Component
const TestimonialsSection = memo(function TestimonialsSection() {
  const handleTestimonialClick = (testimonial: CarouselItem) => {
    console.log('Testimonial clicked:', testimonial.title)
    // Add custom logic here (e.g., open detailed testimonial modal)
  }

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Testimonials from satisfied clients who trusted me with their projects
          </p>
        </motion.div>
        
        <StackedCarousel
          items={portfolioData.testimonials}
          autoPlay={true}
          autoPlayInterval={10000}
          onItemClick={handleTestimonialClick}
          className="mb-8"
        />
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Real feedback from real clients • Click to read full testimonials
          </p>
        </div>
      </div>
    </section>
  )
})

// Services Section Component
const ServicesSection = memo(function ServicesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What I Do</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive development services to bring your ideas to life
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioData.services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
})

// Contact Section (single-page public site)
const ContactSection = memo(function ContactSection() {
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      await apiClient.post('/api/contact', formData)
      setFormData({ name: '', email: '', message: '' })
      addToast({
        type: 'success',
        title: 'Message sent',
        description: 'Thanks for reaching out — I’ll get back to you soon.',
      })
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Could not send message',
        description: err?.message || 'Please try again in a moment.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Let’s Work Together</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Have an opportunity or project in mind? Send a message and I’ll reply as soon as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 mr-4 mt-0.5 opacity-90" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a
                          href={`mailto:${siteConfig.email}`}
                          className="opacity-90 hover:opacity-100 underline underline-offset-4"
                        >
                          {siteConfig.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="w-5 h-5 mr-4 mt-0.5 opacity-90" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <a
                          href={`tel:${siteConfig.phone}`}
                          className="opacity-90 hover:opacity-100 underline underline-offset-4"
                        >
                          {siteConfig.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-4 mt-0.5 opacity-90" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="opacity-90">{siteConfig.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="font-medium mb-2">Availability</p>
                    <p className="opacity-90">{siteConfig.availability}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`mailto:${siteConfig.email}`}>
                  <Button size="lg" variant="secondary" className="min-w-[200px] h-12">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Me
                  </Button>
                </Link>
                <Link href={siteConfig.resumeUrl}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-w-[200px] h-12 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-white text-foreground">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project or opportunity..."
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Sending…' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
})

// Main HomePage Component
const HomePage = memo(function HomePage() {
  const dispatch = useAppDispatch()
  const featuredProjects = useAppSelector(selectProjectsForHomePage)
  const isLoading = useAppSelector(selectProjectsLoading)
  const error = useAppSelector(selectProjectsError)
  const shouldFetch = useAppSelector(state => selectShouldFetchProjects(state, { isFeatured: true }))
  const hasFetched = useRef(false)

  // Add render count monitoring for debugging
  useRenderCount({ 
    componentName: 'HomePage',
    logToConsole: process.env.NODE_ENV === 'development'
  })

  useEffect(() => {
    // Only fetch if we should fetch (no valid cache) and haven't fetched yet
    if (shouldFetch && !hasFetched.current && !isLoading && !error) {
      hasFetched.current = true
      dispatch(fetchProjects({ isFeatured: true }))
    }
  }, []) // Empty dependency array prevents infinite loops

  return (
    <main className="overflow-visible">
      <HeroSection />
      <SkillsSection />
      <AboutSection />
      <FeaturedProjectsSection 
        projects={featuredProjects}
        isLoading={isLoading}
      />
      <ExperienceSection />
      <TestimonialsSection />
      <ServicesSection />
      <ContactSection />
    </main>
  )
})

export default HomePage

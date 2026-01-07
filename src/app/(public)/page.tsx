'use client'

import { useEffect, useRef, memo, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { siteConfig } from '@/constants/site'
import { routes } from '@/constants/routes'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProjects } from '@/store/slices/projectsSlice'
import { 
  selectProjectsForHomePage, 
  selectProjectsLoading, 
  selectProjectsError,
  selectShouldFetchProjects 
} from '@/store/selectors'
import Loader from '@/components/common/Loader'
import ProjectCard from '@/components/common/ProjectCard'
import useRenderCount from '@/hooks/useRenderCount'
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
  Twitter
} from 'lucide-react'

// Portfolio data - ready for CMS integration
const portfolioData = {
  hero: {
    name: siteConfig.name,
    role: siteConfig.role,
    tagline: "Building exceptional digital experiences with modern technologies",
    bio: siteConfig.bio,
    resumeUrl: "/resume.pdf", // Update with actual resume URL
    ctaButtons: [
      { text: "View Projects", href: routes.projects, variant: "default" as const },
      { text: "Download Resume", href: "/resume.pdf", variant: "outline" as const, icon: Download }
    ]
  },
  skills: {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "Angular"],
    backend: ["Node.js", "Express", "Python", "Django", "PHP", "Laravel"],
    database: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase"],
    devops: ["Docker", "AWS", "Vercel", "GitHub Actions", "Nginx"],
    ai: ["OpenAI API", "LangChain", "TensorFlow", "Machine Learning", "NLP"]
  },
  about: {
    short: "Passionate full-stack developer with 5+ years of experience creating scalable web applications. I specialize in modern JavaScript frameworks and cloud technologies, with a focus on user experience and performance optimization.",
    fullBio: "I'm a dedicated full-stack developer who loves turning complex problems into simple, beautiful solutions. With expertise spanning from frontend frameworks to cloud infrastructure, I help businesses build robust digital products that scale."
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
  ]
}

// Hero Section Component
const HeroSection = memo(function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {portfolioData.hero.name}
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-4 font-medium">
            {portfolioData.hero.role}
          </p>
          <p className="text-lg sm:text-xl text-muted-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            {portfolioData.hero.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {portfolioData.hero.ctaButtons.map((button, index) => (
              <Link key={index} href={button.href}>
                <Button size="lg" variant={button.variant} className="min-w-[180px] h-12">
                  {button.icon && <button.icon className="w-4 h-4 mr-2" />}
                  {button.text}
                </Button>
              </Link>
            ))}
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center gap-6 mt-12">
            <Link href={siteConfig.social.github} className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-6 h-6" />
            </Link>
            <Link href={siteConfig.social.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="w-6 h-6" />
            </Link>
            <Link href={siteConfig.social.twitter} className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
})

// Skills Section Component
const SkillsSection = memo(function SkillsSection() {
  const skillCategories = [
    { title: "Frontend", icon: Code, skills: portfolioData.skills.frontend },
    { title: "Backend", icon: Server, skills: portfolioData.skills.backend },
    { title: "Database", icon: Database, skills: portfolioData.skills.database },
    { title: "DevOps", icon: Cloud, skills: portfolioData.skills.devops },
    { title: "AI/ML", icon: Brain, skills: portfolioData.skills.ai }
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Skills & Technologies</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit for building modern web applications
          </p>
        </div>
        
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
      </div>
    </section>
  )
})

// About Section Component
const AboutSection = memo(function AboutSection() {
  const [showFullBio, setShowFullBio] = useState(false)

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">About Me</h2>
          <div className="text-lg text-muted-foreground leading-relaxed mb-6">
            <p className="mb-4">{portfolioData.about.short}</p>
            {showFullBio && (
              <p className="mb-4">{portfolioData.about.fullBio}</p>
            )}
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setShowFullBio(!showFullBio)}
            className="text-primary hover:text-primary/80"
          >
            {showFullBio ? 'Read Less' : 'Read More'}
            <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showFullBio ? 'rotate-90' : ''}`} />
          </Button>
        </div>
      </div>
    </section>
  )
})

// Featured Projects Section
const FeaturedProjectsSection = memo(function FeaturedProjectsSection({
  projects,
  isLoading
}: {
  projects: any[]
  isLoading: boolean
}) {
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

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and technical expertise
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {projectCards}
            </div>
            <div className="text-center">
              <Link href={routes.projects}>
                <Button size="lg" variant="outline">
                  View All Projects
                  <ExternalLink className="w-4 h-4 ml-2" />
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
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Experience</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My professional journey and key milestones
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-border"></div>
            
            {portfolioData.experience.map((exp, index) => (
              <div key={exp.id} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-3 h-3 bg-primary rounded-full border-4 border-background z-10"></div>
                
                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-4 h-4 text-primary mr-2" />
                        <span className="text-sm text-muted-foreground">{exp.period}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{exp.title}</h3>
                      <p className="text-primary font-medium mb-3">{exp.company}</p>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
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
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What I Do</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive development services to bring your ideas to life
          </p>
        </div>
        
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

// Call to Action Section
const CTASection = memo(function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl mb-8 opacity-90">
            Ready to bring your next project to life? I'd love to hear about your ideas and discuss how we can make them reality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href={`mailto:${siteConfig.email}`}>
              <Button size="lg" variant="secondary" className="min-w-[200px] h-12">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </Link>
            <Link href={routes.contact}>
              <Button size="lg" variant="outline" className="min-w-[200px] h-12 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Contact Form
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center text-primary-foreground/80">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{siteConfig.location}</span>
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
    <main className="overflow-hidden">
      <HeroSection />
      <SkillsSection />
      <AboutSection />
      <FeaturedProjectsSection 
        projects={featuredProjects}
        isLoading={isLoading}
      />
      <ExperienceSection />
      <ServicesSection />
      <CTASection />
    </main>
  )
})

export default HomePage

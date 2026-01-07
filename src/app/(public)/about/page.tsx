'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/constants/site'
import { routes } from '@/constants/routes'
import Link from 'next/link'
import { 
  Download, 
  Mail, 
  MapPin, 
  Calendar,
  Code,
  Database,
  Server,
  Cloud,
  Brain,
  Github,
  Linkedin,
  Twitter,
  Award,
  Users,
  Coffee
} from 'lucide-react'

const aboutData = {
  intro: "I'm a passionate full-stack developer with over 5 years of experience creating digital solutions that make a difference. My journey in web development started with a curiosity about how things work on the internet, and it has evolved into a career dedicated to building exceptional user experiences.",
  
  story: "My development journey began during college when I built my first website for a local business. Since then, I've worked with startups, agencies, and enterprises, helping them transform ideas into scalable web applications. I believe in writing clean, maintainable code and staying up-to-date with the latest technologies.",
  
  approach: "I approach every project with a user-first mindset, focusing on performance, accessibility, and scalability. Whether it's a simple landing page or a complex web application, I ensure that the end product not only meets technical requirements but also provides an exceptional user experience.",
  
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
}

export default function AboutPage() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Me</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn more about my journey, values, and what drives me as a developer
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-16">
            <Card>
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                  {aboutData.intro}
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                  {aboutData.story}
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {aboutData.approach}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {aboutData.stats.map((stat, index) => (
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
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">My Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutData.values.map((value, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-16">
            <Card className="bg-muted/30">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-6">Let's Connect</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{siteConfig.email}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{siteConfig.location}</span>
                  </div>
                </div>
                
                {/* Social Links */}
                <div className="flex justify-center gap-6 mb-8">
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

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={routes.contact}>
                    <Button size="lg">
                      <Mail className="w-4 h-4 mr-2" />
                      Get In Touch
                    </Button>
                  </Link>
                  <Link href={siteConfig.resumeUrl}>
                    <Button size="lg" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
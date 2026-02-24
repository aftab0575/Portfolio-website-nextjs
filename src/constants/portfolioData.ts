import { siteConfig } from '@/constants/site'
import { routes } from '@/constants/routes'
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
  Send,
} from 'lucide-react'
import type { CarouselItem } from '@/components/ui/stacked-carousel'

export const portfolioData = {
  hero: {
    name: siteConfig.name,
    role: siteConfig.role,
    tagline: 'Building exceptional digital experiences with modern technologies',
    bio: siteConfig.bio,
    imageUrl:
      'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=1200&h=1600&fit=crop&crop=face',
    imageAlt: 'Portrait artwork for hero section',
    resumeUrl: '/resume.pdf', // Update with actual resume URL
    ctaButtons: [
      { text: 'View Projects', href: routes.sections.projects, variant: 'default' as const },
      { text: 'Download Resume', href: '/resume.pdf', variant: 'outline' as const, icon: Download },
    ],
  },
  skills: {
    frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'Angular'],
    backend: ['Node.js', 'Express', 'Python', 'Django', 'PHP', 'Laravel'],
    database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase'],
    devops: ['Docker', 'AWS', 'Vercel', 'GitHub Actions', 'Nginx'],
    ai: ['OpenAI API', 'LangChain', 'TensorFlow', 'Machine Learning', 'NLP'],
    // Carousel data for interactive skills showcase
    carouselData: [
      {
        id: 'frontend',
        title: 'Frontend Development',
        subtitle: 'Modern UI/UX with React & Next.js',
        image:
          'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&crop=center',
        description:
          'Building responsive, accessible, and performant user interfaces with React, Next.js, TypeScript, and Tailwind CSS.',
      },
      {
        id: 'backend',
        title: 'Backend Development',
        subtitle: 'Scalable APIs & Server Architecture',
        image:
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center',
        description:
          'Creating robust server-side applications with Node.js, Express, Python, and cloud-native architectures.',
      },
      {
        id: 'database',
        title: 'Database Design',
        subtitle: 'Data Modeling & Optimization',
        image:
          'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop&crop=center',
        description:
          'Designing efficient database schemas with MongoDB, PostgreSQL, and implementing caching strategies.',
      },
      {
        id: 'devops',
        title: 'DevOps & Cloud',
        subtitle: 'CI/CD & Infrastructure as Code',
        image:
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center',
        description:
          'Automating deployments with Docker, AWS, GitHub Actions, and monitoring production systems.',
      },
      {
        id: 'mobile',
        title: 'Mobile Development',
        subtitle: 'Cross-Platform Apps',
        image:
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center',
        description:
          'Building native and cross-platform mobile applications with React Native and Flutter.',
      },
      {
        id: 'ai',
        title: 'AI & Machine Learning',
        subtitle: 'Intelligent Solutions',
        image:
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=center',
        description:
          'Integrating AI capabilities with OpenAI API, LangChain, and building intelligent web applications.',
      },
    ] as CarouselItem[],
  },
  about: {
    short:
      "Passionate full-stack developer with 5+ years of experience creating scalable web applications. I specialize in modern JavaScript frameworks and cloud technologies, with a focus on user experience and performance optimization.",
    fullBio:
      "I'm a dedicated full-stack developer who loves turning complex problems into simple, beautiful solutions. With expertise spanning from frontend frameworks to cloud infrastructure, I help businesses build robust digital products that scale.",
    story:
      'My development journey began during college when I built my first website for a local business. Since then, I\'ve worked with startups, agencies, and enterprises, helping them transform ideas into scalable web applications.',
    approach:
      'I approach every project with a user-first mindset, focusing on performance, accessibility, and scalability. Whether it\'s a simple landing page or a complex web application, I ensure the end product provides an exceptional user experience.',
    stats: [
      { icon: Code, label: 'Projects Completed', value: '50+' },
      { icon: Users, label: 'Happy Clients', value: '30+' },
      { icon: Coffee, label: 'Cups of Coffee', value: '1000+' },
      { icon: Award, label: 'Years Experience', value: '5+' },
    ],
    values: [
      {
        title: 'Quality First',
        description: 'I believe in delivering high-quality code that is maintainable, scalable, and follows best practices.',
        icon: Award,
      },
      {
        title: 'Continuous Learning',
        description: "Technology evolves rapidly, and I'm committed to staying current with the latest trends and tools.",
        icon: Brain,
      },
      {
        title: 'Collaboration',
        description: 'Great products are built by great teams. I value open communication and collaborative problem-solving.',
        icon: Users,
      },
      {
        title: 'User-Centric',
        description:
          'Every line of code I write is with the end user in mind, ensuring the best possible experience.',
        icon: Code,
      },
    ],
  },
  experience: [
    {
      id: 1,
      title: 'Senior Full-Stack Developer',
      company: 'Tech Solutions Inc.',
      period: '2022 - Present',
      description: 'Leading development of enterprise web applications using React, Node.js, and AWS.',
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'Digital Agency',
      period: '2020 - 2022',
      description: 'Built responsive web applications and improved user experience for 20+ clients.',
    },
    {
      id: 3,
      title: 'Junior Developer',
      company: 'StartupCo',
      period: '2019 - 2020',
      description: 'Developed features for SaaS platform using Vue.js and Python Django.',
    },
  ],
  services: [
    {
      title: 'Web Development',
      description: 'Custom web applications built with modern frameworks and best practices.',
      icon: Code,
    },
    {
      title: 'API Development',
      description: 'RESTful APIs and GraphQL services for scalable backend solutions.',
      icon: Server,
    },
    {
      title: 'Cloud Solutions',
      description: 'AWS and cloud infrastructure setup for reliable, scalable applications.',
      icon: Cloud,
    },
    {
      title: 'AI Integration',
      description: 'Implementing AI and machine learning features into web applications.',
      icon: Brain,
    },
  ],
  testimonials: [
    {
      id: 'client1',
      title: 'Sarah Johnson',
      subtitle: 'CEO, TechStart Inc.',
      image:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      description:
        '"Exceptional work quality and attention to detail. Delivered our project ahead of schedule with outstanding results. The level of professionalism and technical expertise exceeded our expectations."',
    },
    {
      id: 'client2',
      title: 'Michael Chen',
      subtitle: 'CTO, Digital Solutions',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      description:
        "Professional, reliable, and technically excellent. The best developer we've worked with for our enterprise solutions. Transformed our complex requirements into elegant, scalable code.",
    },
    {
      id: 'client3',
      title: 'Emily Rodriguez',
      subtitle: 'Product Manager, InnovateCorp',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      description:
        '"Transformed our vision into reality with clean code and beautiful design. Highly recommend for any project requiring both technical skill and creative problem-solving."',
    },
    {
      id: 'client4',
      title: 'David Kim',
      subtitle: 'Founder, StartupLab',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      description:
        '"Outstanding developer who understands both the technical and business aspects of projects. Delivered a robust platform that scaled perfectly with our growth."',
    },
  ] as CarouselItem[],
}


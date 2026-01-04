import { siteConfig } from '@/constants/site'
import { Button } from '@/components/ui/button'
import { getAllExperience } from '@/modules/experience/services'
import { Experience } from '@/types/experience'
import { formatDateRange } from '@/utils/formatDate'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'

async function getExperiences(): Promise<Experience[]> {
  const getCachedExperiences = unstable_cache(
    async () => {
      try {
        const experiences = await getAllExperience()
        return experiences.slice(0, 3)
      } catch (error) {
        return []
      }
    },
    ['experiences-summary'],
    {
      revalidate: 300, // Cache for 5 minutes
    }
  )

  return getCachedExperiences()
}

export default async function AboutPage() {
  const experiences = await getExperiences()

  return (
    <main className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">About Me</h1>

            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-xl text-gray-700 leading-relaxed">{siteConfig.bio}</p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Experience</h2>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp._id} className="border-l-4 border-primary pl-6">
                    <h3 className="text-xl font-semibold">{exp.role}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <a href="/resume.pdf" download>
                <Button>Download Resume</Button>
              </a>
              <Link href="/contact">
                <Button variant="outline">Contact Me</Button>
              </Link>
            </div>
          </div>
        </div>
    </main>
  )
}


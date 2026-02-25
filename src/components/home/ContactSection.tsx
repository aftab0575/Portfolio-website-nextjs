'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { siteConfig } from '@/constants/site'
import { Download, Mail, MapPin, Phone, Send } from 'lucide-react'
import apiClient from '@/services/apiClient'
import { useToast } from '@/hooks/useToast'

const ContactSection = memo(function ContactSection() {
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
              Have an opportunity or project in mind? Send a message and I’ll reply as soon as
              possible.
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

export default ContactSection


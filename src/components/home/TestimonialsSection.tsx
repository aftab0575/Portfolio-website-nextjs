'use client'

import { memo } from 'react'
import { portfolioData } from '@/constants/portfolioData'

const TestimonialsSection = memo(function TestimonialsSection() {
  const testimonials = portfolioData.testimonials.slice(0, 3)

  return (
    <section id="testimonials" className="py-20 sm:py-24 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="text-center">
            <p className="text-base sm:text-lg font-medium text-muted-foreground">
              2,157 people have said how good my work is
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-foreground">
              Our happy clients say about us
            </h2>
          </div>

          <div className="mt-8 text-center md:mt-16 md:order-3">
            <a
              href="#projects"
              className="inline-block pb-2 text-base font-bold leading-7 text-foreground border-b-2 border-foreground/80 hover:border-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-foreground focus:ring-offset-2"
            >
              Check all reviews
            </a>
          </div>

          <div className="relative mt-10 md:mt-24 md:order-2 w-full">
            <div className="absolute -inset-x-1 inset-y-16 md:-inset-x-2 md:-inset-y-6">
              <div
                className="w-full h-full max-w-5xl mx-auto rounded-3xl opacity-30 blur-lg filter"
                style={{
                  background:
                    'linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)',
                }}
              />
            </div>

            <div className="relative grid max-w-lg grid-cols-1 gap-6 mx-auto md:max-w-none lg:gap-10 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex flex-col overflow-hidden rounded-3xl bg-card/95 border border-border/60 shadow-xl"
                >
                  <div className="flex flex-col justify-between flex-1 p-6 lg:py-8 lg:px-7">
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-[#FDB241]"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      <blockquote className="flex-1 mt-6">
                        <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
                          “{testimonial.description}”
                        </p>
                      </blockquote>
                    </div>

                    <div className="flex items-center mt-8">
                      <img
                        className="flex-shrink-0 object-cover rounded-full w-11 h-11"
                        src={testimonial.image}
                        alt={testimonial.title}
                      />
                      <div className="ml-4 text-left">
                        <p className="text-base font-semibold text-foreground">
                          {testimonial.title}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {testimonial.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default TestimonialsSection



'use client'

import { memo, useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const testimonialsData = [
    {
      id: 'fiverr-1',
      text:
        'Aftab Bashir is a professional and talented personnel. I have been his long time client and he has always exceeded my expectations. This current project he delivered me within a day with high quality. I was really amazed by his meticulous work. He is very diligent and it is fun to work with him.',
      name: 'Long‑term client',
      role: 'Fiverr Review',
      avatar: 'https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-male-1.png',
    },
    {
      id: 'fiverr-2',
      text:
        "Aftab is a very professional and highly talented personnel. To an old client like me he can even deliver emergency service in a day. I was amazed that even on short notice he was able to provide a high‑quality product. He is very reliable to work with and also has excellent tutoring skills.",
      name: 'Returning client',
      role: 'Fiverr Review',
      avatar: 'https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-male-2.png',
    },
    {
      id: 'upwork-1',
      text:
        'He is a professional coder with high‑level expertise. He exceeded my expectations, and he is very cooperative and helpful.',
      name: 'Project partner',
      role: 'Upwork Review',
      avatar: 'https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-female.png',
    },
    {
      id: 'fiverr-3',
      text:
        'Very good experience working with Aftab Bashir. He was responsive, delivered on time, and the quality of work was exactly what I needed. I would definitely hire him again for future projects.',
      name: 'Satisfied client',
      role: 'Fiverr Review',
      avatar: 'https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-male-1.png',
    },
    {
      id: 'upwork-2',
      text:
        'It has been a pleasure to work with him—such a hardworking and talented professional. He takes ownership of tasks, communicates clearly, and always goes the extra mile. Highly recommend for any team.',
      name: 'Team lead',
      role: 'Upwork Review',
      avatar: 'https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-male-2.png',
    },
    {
      id: 'fiverr-4',
      text:
        'Very thorough, detailed tutoring. He is an expert at explaining difficult topics in a simple way. My understanding improved quickly, and he was patient and well prepared. Great tutor.',
      name: 'Student',
      role: 'Fiverr Review',
      avatar: 'https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-female.png',
    },
  ] as const

const TestimonialsSection = memo(function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const total = testimonialsData.length

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % total)
  }, [total])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + total) % total)
  }, [total])

  useEffect(() => {
    const t = setInterval(goNext, 6000)
    return () => clearInterval(t)
  }, [goNext])

  return (
    <section id="testimonials" className="py-20 sm:py-24 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="text-center">
            <p className="text-base sm:text-lg font-medium text-muted-foreground">
              2,157 people have said how good my work is
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-foreground">
              Clients from Fiver/Upwork say about me
            </h2>
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

            <div className="relative max-w-2xl mx-auto overflow-hidden">
              {/* Cards strip - items-stretch so all cards match tallest height */}
              <div
                className="flex items-stretch transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonialsData.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-2 sm:px-4 flex"
                  >
                    <div className="testimonial-card flex flex-col overflow-hidden rounded-3xl w-full min-h-[320px] border border-primary/30 shadow-[0_8px_32px_hsl(var(--primary)/0.12),0_0_0_1px_hsl(var(--primary)/0.08)]">
                      <div className="flex flex-col justify-between flex-1 min-h-[320px] p-6 lg:py-8 lg:px-7">
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
                              “{testimonial.text}”
                            </p>
                          </blockquote>
                        </div>

                        <div className="flex items-center mt-8">
                          <img
                            className="flex-shrink-0 object-cover rounded-full w-11 h-11"
                            src={testimonial.avatar}
                            alt={testimonial.name}
                          />
                          <div className="ml-4 text-left">
                            <p className="text-base font-semibold text-foreground">
                              {testimonial.name}
                            </p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prev / Next */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={goPrev}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex gap-2">
                  {testimonialsData.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === currentIndex
                          ? 'w-6 bg-primary'
                          : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={goNext}
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default TestimonialsSection



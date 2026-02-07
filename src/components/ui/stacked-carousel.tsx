'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface CarouselItem {
  id: string | number
  title: string
  subtitle: string
  image: string
  description?: string
}

interface StackedCarouselProps {
  items: CarouselItem[]
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
  onItemClick?: (item: CarouselItem) => void
}

const StackedCarousel = ({
  items,
  className,
  autoPlay = false,
  autoPlayInterval = 5000,
  onItemClick
}: StackedCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Clear any existing interval
  const clearAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Navigation functions with stable references
  const goToNext = useCallback(() => {
    if (items.length <= 1) return
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
  }, [items.length])

  const goToPrevious = useCallback(() => {
    if (items.length <= 1) return
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
  }, [items.length])

  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex || items.length <= 1) return
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }, [currentIndex, items.length])

  // Start auto-play
  const startAutoPlay = useCallback(() => {
    if (!autoPlay || items.length <= 1) return
    
    clearAutoPlay()
    intervalRef.current = setInterval(() => {
      goToNext()
    }, autoPlayInterval)
  }, [autoPlay, autoPlayInterval, items.length, goToNext, clearAutoPlay])

  // Stop auto-play
  const stopAutoPlay = useCallback(() => {
    setIsAutoPlaying(false)
    clearAutoPlay()
  }, [clearAutoPlay])

  // Resume auto-play
  const resumeAutoPlay = useCallback(() => {
    if (autoPlay && items.length > 1) {
      setIsAutoPlaying(true)
      startAutoPlay()
    }
  }, [autoPlay, items.length, startAutoPlay])

  // Auto-play effect - only restart when necessary
  useEffect(() => {
    if (autoPlay && items.length > 1 && isAutoPlaying) {
      startAutoPlay()
    } else {
      clearAutoPlay()
    }

    return clearAutoPlay
  }, [autoPlay, items.length, isAutoPlaying, startAutoPlay, clearAutoPlay])

  // Reset current index if items change
  useEffect(() => {
    if (currentIndex >= items.length && items.length > 0) {
      setCurrentIndex(0)
    }
  }, [items.length, currentIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        stopAutoPlay()
        goToPrevious()
        setTimeout(resumeAutoPlay, 3000)
      } else if (event.key === 'ArrowRight') {
        stopAutoPlay()
        goToNext()
        setTimeout(resumeAutoPlay, 3000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrevious, stopAutoPlay, resumeAutoPlay])

  // Handle mouse interactions
  const handleMouseEnter = useCallback(() => {
    if (autoPlay) {
      stopAutoPlay()
    }
  }, [autoPlay, stopAutoPlay])

  const handleMouseLeave = useCallback(() => {
    if (autoPlay) {
      setTimeout(resumeAutoPlay, 1000)
    }
  }, [autoPlay, resumeAutoPlay])

  // Get visible items with their target positions
  const getVisibleItems = useCallback(() => {
    if (items.length === 0) return []
    if (items.length === 1) return [{ item: items[0], position: 'center' as const, index: 0 }]
    if (items.length === 2) {
      return [
        { item: items[currentIndex], position: 'center' as const, index: currentIndex },
        { item: items[(currentIndex + 1) % items.length], position: 'right' as const, index: (currentIndex + 1) % items.length }
      ]
    }

    const prevIndex = (currentIndex - 1 + items.length) % items.length
    const nextIndex = (currentIndex + 1) % items.length

    return [
      { item: items[prevIndex], position: 'left' as const, index: prevIndex },
      { item: items[currentIndex], position: 'center' as const, index: currentIndex },
      { item: items[nextIndex], position: 'right' as const, index: nextIndex }
    ]
  }, [items, currentIndex])

  const visibleItems = getVisibleItems()

  // Enhanced animation variants with proper exit animations
  const cardVariants = {
    // Entry from right (for next navigation)
    enterFromRight: {
      x: 300,
      scale: 0.6,
      opacity: 0,
      zIndex: 0,
      rotateY: -25,
    },
    // Entry from left (for previous navigation)
    enterFromLeft: {
      x: -300,
      scale: 0.6,
      opacity: 0,
      zIndex: 0,
      rotateY: 25,
    },
    // Positions
    left: {
      x: -120,
      scale: 0.8,
      opacity: 0.6,
      zIndex: 1,
      rotateY: 15,
    },
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
      zIndex: 3,
      rotateY: 0,
    },
    right: {
      x: 120,
      scale: 0.8,
      opacity: 0.6,
      zIndex: 1,
      rotateY: -15,
    },
    // Exit animations
    exitToLeft: {
      x: -300,
      scale: 0.6,
      opacity: 0,
      zIndex: 0,
      rotateY: 25,
    },
    exitToRight: {
      x: 300,
      scale: 0.6,
      opacity: 0,
      zIndex: 0,
      rotateY: -25,
    }
  }

  // Get animation states for each card
  const getCardAnimation = (position: string, itemId: string | number) => {
    let initial = cardVariants[position as keyof typeof cardVariants]
    let animate = cardVariants[position as keyof typeof cardVariants]
    let exit = cardVariants.exitToLeft

    if (direction > 0) {
      // Moving forward (next)
      if (position === 'center') {
        initial = cardVariants.enterFromRight
      } else if (position === 'right') {
        initial = cardVariants.enterFromRight
      }
      exit = cardVariants.exitToLeft
    } else if (direction < 0) {
      // Moving backward (previous)
      if (position === 'center') {
        initial = cardVariants.enterFromLeft
      } else if (position === 'left') {
        initial = cardVariants.enterFromLeft
      }
      exit = cardVariants.exitToRight
    }

    return { initial, animate, exit }
  }

  if (items.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-96", className)}>
        <p className="text-muted-foreground">No items to display</p>
      </div>
    )
  }

  return (
    <div 
      className={cn("relative w-full max-w-4xl mx-auto", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main carousel container */}
      <div className="relative h-96 md:h-[28rem] flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false}>
          {visibleItems.map(({ item, position, index }) => {
            const animation = getCardAnimation(position, item.id)
            
            return (
              <motion.div
                key={item.id}
                className="absolute cursor-pointer"
                initial={animation.initial}
                animate={animation.animate}
                exit={animation.exit}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "tween"
                }}
                onClick={() => {
                  if (position === 'center' && onItemClick) {
                    stopAutoPlay()
                    onItemClick(item)
                    setTimeout(resumeAutoPlay, 5000)
                  } else if (position === 'left') {
                    stopAutoPlay()
                    goToPrevious()
                    setTimeout(resumeAutoPlay, 3000)
                  } else if (position === 'right') {
                    stopAutoPlay()
                    goToNext()
                    setTimeout(resumeAutoPlay, 3000)
                  }
                }}
                whileHover={position === 'center' ? { scale: 1.02 } : undefined}
                style={{ perspective: '1000px' }}
              >
                <div className={cn(
                  "relative w-72 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl",
                  "bg-gradient-to-br from-background to-muted border border-border",
                  position === 'center' 
                    ? "shadow-2xl ring-2 ring-primary/20" 
                    : "shadow-lg hover:shadow-xl transition-shadow"
                )}>
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-200 mb-3 line-clamp-2">
                        {item.subtitle}
                      </p>
                      {item.description && position === 'center' && (
                        <p className="text-xs md:text-sm text-gray-300 line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </motion.div>
                  </div>

                  {/* Highlight indicator for center card */}
                  {position === 'center' && (
                    <motion.div
                      className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    />
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {items.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-background/90 shadow-lg"
            onClick={() => {
              stopAutoPlay()
              goToPrevious()
              setTimeout(resumeAutoPlay, 3000)
            }}
            aria-label="Previous item"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-background/90 shadow-lg"
            onClick={() => {
              stopAutoPlay()
              goToNext()
              setTimeout(resumeAutoPlay, 3000)
            }}
            aria-label="Next item"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </>
      )}

      {/* Dots indicator */}
      {items.length > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              onClick={() => {
                stopAutoPlay()
                goToSlide(index)
                setTimeout(resumeAutoPlay, 3000)
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {autoPlay && items.length > 1 && isAutoPlaying && (
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-white">Auto</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default StackedCarousel
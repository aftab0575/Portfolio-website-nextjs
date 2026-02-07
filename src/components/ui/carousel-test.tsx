'use client'

import { useState } from 'react'
import StackedCarousel, { CarouselItem } from './stacked-carousel'
import { Button } from './button'

const testData: CarouselItem[] = [
  {
    id: 1,
    title: 'Test Card 1',
    subtitle: 'First test card',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
    description: 'This is the first test card to verify carousel functionality.'
  },
  {
    id: 2,
    title: 'Test Card 2',
    subtitle: 'Second test card',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    description: 'This is the second test card to verify carousel functionality.'
  },
  {
    id: 3,
    title: 'Test Card 3',
    subtitle: 'Third test card',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop',
    description: 'This is the third test card to verify carousel functionality.'
  }
]

export default function CarouselTest() {
  const [autoPlay, setAutoPlay] = useState(true)

  const handleItemClick = (item: CarouselItem) => {
    console.log('Clicked item:', item.title)
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Carousel Test</h2>
        <div className="flex justify-center gap-4 mb-4">
          <Button
            variant={autoPlay ? 'default' : 'outline'}
            onClick={() => setAutoPlay(true)}
          >
            Auto Play On
          </Button>
          <Button
            variant={!autoPlay ? 'default' : 'outline'}
            onClick={() => setAutoPlay(false)}
          >
            Auto Play Off
          </Button>
        </div>
      </div>
      
      <StackedCarousel
        items={testData}
        autoPlay={autoPlay}
        autoPlayInterval={3000}
        onItemClick={handleItemClick}
      />
      
      <div className="text-center mt-8 text-sm text-muted-foreground">
        <p>Test the carousel functionality:</p>
        <ul className="mt-2 space-y-1">
          <li>• Auto-play should rotate every 3 seconds when enabled</li>
          <li>• Hover to pause auto-play</li>
          <li>• Click side cards to navigate</li>
          <li>• Use arrow keys to navigate</li>
          <li>• Click dots to jump to specific slides</li>
        </ul>
      </div>
    </div>
  )
}
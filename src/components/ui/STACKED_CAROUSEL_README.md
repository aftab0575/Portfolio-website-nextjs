# Stacked Card Carousel Component

A modern, interactive carousel component built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. Perfect for showcasing skills, projects, testimonials, or any content that benefits from visual storytelling.

## Features

### 🎨 Visual Design
- **Stacked card layout** with depth and perspective
- **Center card highlighting** with scale and opacity effects
- **Smooth animations** powered by Framer Motion
- **Modern UI** with gradients, shadows, and blur effects
- **Responsive design** that works on all screen sizes

### 🎯 Interaction
- **Click navigation** - click side cards to navigate
- **Keyboard support** - use arrow keys to navigate
- **Auto-play functionality** with customizable intervals
- **Progress indicator** for auto-play mode
- **Dot indicators** for direct slide access

### ♿ Accessibility
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **Focus management** for better UX
- **Semantic HTML** structure

### ⚡ Performance
- **Optimized animations** with hardware acceleration
- **Efficient re-rendering** with proper memoization
- **Smooth 60fps animations** using Framer Motion
- **Lazy loading ready** for images

## Installation

The component uses the following dependencies (already included in your project):
- `framer-motion` - for animations
- `lucide-react` - for icons
- `tailwindcss` - for styling
- `clsx` & `tailwind-merge` - for className utilities

## Basic Usage

```tsx
import StackedCarousel, { CarouselItem } from '@/components/ui/stacked-carousel'

const items: CarouselItem[] = [
  {
    id: 'item1',
    title: 'Frontend Development',
    subtitle: 'React & Next.js',
    image: 'https://example.com/image1.jpg',
    description: 'Building modern web applications'
  },
  // ... more items
]

function MyComponent() {
  return (
    <StackedCarousel
      items={items}
      autoPlay={true}
      autoPlayInterval={5000}
      onItemClick={(item) => console.log('Clicked:', item)}
    />
  )
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `items` | `CarouselItem[]` | Array of items to display in the carousel |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes for the container |
| `autoPlay` | `boolean` | `false` | Enable automatic slide progression |
| `autoPlayInterval` | `number` | `5000` | Interval in milliseconds for auto-play |
| `onItemClick` | `(item: CarouselItem) => void` | `undefined` | Callback when an item is clicked |

### CarouselItem Interface

```tsx
interface CarouselItem {
  id: string | number        // Unique identifier
  title: string             // Main title text
  subtitle: string          // Subtitle text
  image: string             // Image URL
  description?: string      // Optional description (shown on center card)
}
```

## Advanced Usage

### Skills Showcase

```tsx
const skillsData: CarouselItem[] = [
  {
    id: 'react',
    title: 'React & Next.js',
    subtitle: 'Frontend Framework',
    image: '/images/react-bg.jpg',
    description: 'Building modern, performant web applications'
  },
  {
    id: 'nodejs',
    title: 'Node.js',
    subtitle: 'Backend Development',
    image: '/images/nodejs-bg.jpg',
    description: 'Creating scalable server-side applications'
  }
]

function SkillsSection() {
  const handleSkillClick = (skill: CarouselItem) => {
    // Navigate to skill detail page
    router.push(`/skills/${skill.id}`)
  }

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-center mb-12">My Skills</h2>
      <StackedCarousel
        items={skillsData}
        autoPlay={true}
        autoPlayInterval={4000}
        onItemClick={handleSkillClick}
      />
    </section>
  )
}
```

### Project Portfolio

```tsx
const projectsData: CarouselItem[] = [
  {
    id: 'ecommerce',
    title: 'E-Commerce Platform',
    subtitle: 'Next.js • TypeScript • Stripe',
    image: '/images/ecommerce-preview.jpg',
    description: 'Full-featured online store with payment processing'
  }
]

function ProjectsCarousel() {
  return (
    <StackedCarousel
      items={projectsData}
      onItemClick={(project) => {
        window.open(project.liveUrl, '_blank')
      }}
    />
  )
}
```

### Testimonials

```tsx
const testimonials: CarouselItem[] = [
  {
    id: 'client1',
    title: 'Sarah Johnson',
    subtitle: 'CEO, TechStart Inc.',
    image: '/images/client1.jpg',
    description: '"Exceptional work quality and professional service."'
  }
]

function TestimonialsSection() {
  return (
    <div className="bg-muted/30 py-20">
      <h2 className="text-3xl font-bold text-center mb-12">Client Testimonials</h2>
      <StackedCarousel
        items={testimonials}
        autoPlay={true}
        autoPlayInterval={6000}
      />
    </div>
  )
}
```

## Customization

### Styling

The component uses Tailwind CSS classes and can be customized by:

1. **Container styling** - pass `className` prop
2. **Theme variables** - uses CSS custom properties for colors
3. **Card dimensions** - modify the component's internal classes
4. **Animation timing** - adjust Framer Motion transition values

### Custom Card Layout

To customize the card appearance, modify the card container classes in the component:

```tsx
// Current card classes
"relative w-72 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl"

// Example: Smaller cards
"relative w-64 h-72 md:w-72 md:h-80 rounded-xl overflow-hidden shadow-xl"
```

### Animation Variants

Customize the animation behavior by modifying the `cardVariants` object:

```tsx
const cardVariants = {
  left: {
    x: -120,        // Horizontal offset
    scale: 0.8,     // Scale factor
    opacity: 0.6,   // Opacity level
    zIndex: 1,      // Stacking order
    rotateY: 15,    // 3D rotation
  },
  // ... other variants
}
```

## Responsive Behavior

The carousel automatically adapts to different screen sizes:

- **Mobile (< 768px)**: Single card view with navigation
- **Tablet (768px - 1024px)**: Reduced spacing and smaller cards
- **Desktop (> 1024px)**: Full three-card layout with optimal spacing

## Accessibility Features

- **Keyboard Navigation**: Arrow keys for navigation
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and structure

## Performance Considerations

- **Memoization**: Component is optimized for re-renders
- **Hardware Acceleration**: Animations use GPU acceleration
- **Image Optimization**: Use Next.js Image component for better performance
- **Lazy Loading**: Consider implementing for large datasets

## Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Fallbacks**: Graceful degradation for older browsers

## Troubleshooting

### Common Issues

1. **Images not loading**: Ensure image URLs are accessible and properly formatted
2. **Animation stuttering**: Check for heavy re-renders in parent components
3. **Touch navigation not working**: Ensure proper touch event handling on mobile

### Performance Tips

1. **Optimize images**: Use appropriate formats and sizes
2. **Limit items**: Consider pagination for large datasets
3. **Memoize callbacks**: Use `useCallback` for `onItemClick` handlers
4. **Reduce motion**: Respect user's motion preferences

## Examples

See the following files for complete implementation examples:
- `/src/app/(public)/skills/page.tsx` - Full demo page
- `/src/components/sections/SkillsCarousel.tsx` - Skills-specific implementation
- `/src/examples/StackedCarouselUsage.tsx` - Various usage patterns

## License

This component is part of your portfolio project and follows the same license terms.
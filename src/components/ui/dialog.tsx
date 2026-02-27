import * as React from 'react'
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onExitComplete?: () => void
  children: React.ReactNode
}

const EXIT_DURATION = 0.35

const Dialog = ({ open, onOpenChange, onExitComplete, children }: DialogProps) => {
  const wasOpenRef = useRef(open)
  const [exitDone, setExitDone] = useState(false)
  const isExiting = !open && wasOpenRef.current && !exitDone
  const isVisible = open || isExiting

  useEffect(() => {
    wasOpenRef.current = open
    if (open) setExitDone(false)
  }, [open])

  const handleClose = useCallback(() => {
    onOpenChange?.(false)
  }, [onOpenChange])

  const handleExitComplete = useCallback(() => {
    setExitDone(true)
    onExitComplete?.()
  }, [onExitComplete])

  if (!isVisible) return null

  return (
    <motion.div
      initial={!isExiting ? { opacity: 0 } : false}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: isExiting ? EXIT_DURATION : 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={!isExiting ? { opacity: 0 } : false}
        animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: isExiting ? EXIT_DURATION : 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 bg-black/40 backdrop-blur-md"
        onClick={handleClose}
        style={{ pointerEvents: isExiting ? 'none' : 'auto' }}
      />
      <motion.div
        initial={!isExiting ? { opacity: 0, scale: 0.2, y: 80 } : false}
        animate={
          isExiting
            ? { opacity: 0, scale: 0.2, y: 80 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={{
          duration: EXIT_DURATION,
          ease: [0.32, 0.72, 0, 1],
        }}
        onAnimationComplete={() => {
          if (isExiting) handleExitComplete()
        }}
        style={{ transformOrigin: '50% 100%' }}
        className="relative z-50"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
      className
    )}
    {...props}
  >
    {children}
  </div>
))
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
DialogDescription.displayName = 'DialogDescription'

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription }


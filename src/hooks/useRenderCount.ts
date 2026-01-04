import { useRef, useEffect } from 'react'

interface RenderCountOptions {
  componentName?: string
  logToConsole?: boolean
  logThreshold?: number
}

export function useRenderCount(options: RenderCountOptions = {}) {
  const {
    componentName = 'Component',
    logToConsole = process.env.NODE_ENV === 'development',
    logThreshold = 5
  } = options

  const renderCount = useRef(0)
  const mountTime = useRef<number>()

  useEffect(() => {
    if (!mountTime.current) {
      mountTime.current = Date.now()
    }
  }, [])

  renderCount.current += 1

  useEffect(() => {
    if (logToConsole) {
      const timeSinceMount = mountTime.current ? Date.now() - mountTime.current : 0
      
      if (renderCount.current >= logThreshold) {
        console.warn(
          `🔄 [Render Monitor] ${componentName} has rendered ${renderCount.current} times in ${timeSinceMount}ms`
        )
      } else {
        console.log(
          `🔄 [Render Monitor] ${componentName} render #${renderCount.current} (${timeSinceMount}ms since mount)`
        )
      }
    }
  })

  return {
    renderCount: renderCount.current,
    timeSinceMount: mountTime.current ? Date.now() - mountTime.current : 0
  }
}

export default useRenderCount
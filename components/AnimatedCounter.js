import { useState, useEffect } from 'react'

export default function AnimatedCounter({ 
  value, 
  duration = 1000, 
  className = "" 
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const [previousValue, setPreviousValue] = useState(0)

  useEffect(() => {
    if (value === displayValue) return

    setPreviousValue(displayValue)
    
    const startTime = Date.now()
    const startValue = displayValue
    const endValue = parseInt(value) || 0
    const difference = endValue - startValue

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function untuk animasi yang smooth
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      const currentValue = Math.round(startValue + (difference * easeOutQuart))
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration, displayValue])

  const hasChanged = previousValue !== displayValue && previousValue !== 0
  const isIncreasing = displayValue > previousValue

  return (
    <span 
      className={`${className} ${
        hasChanged 
          ? isIncreasing 
            ? 'text-green-600 animate-pulse' 
            : 'text-red-600 animate-pulse'
          : ''
      } transition-colors duration-500`}
    >
      {displayValue.toLocaleString('id-ID')}
    </span>
  )
}
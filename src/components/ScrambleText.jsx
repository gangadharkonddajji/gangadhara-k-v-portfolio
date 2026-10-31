import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/'

/**
 * Technical HUD decode text effect.
 * Locks into real text from left to right while displaying random technical glyphs.
 */
export default function ScrambleText({
  text = '',
  as: Tag = 'span',
  className = '',
  delay = 0,
  speed = 30,
  trigger = 'view',
}) {
  const containerRef = useRef(null)
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    // If reduced motion is requested or text is empty, keep initial text
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !text) {
      return
    }

    let intervalId = null
    let timeoutId = null
    let observer = null
    let hasStarted = false

    const startScramble = () => {
      if (hasStarted) return
      hasStarted = true

      timeoutId = setTimeout(() => {
        let frame = 0

        intervalId = setInterval(() => {
          // Lock one more character from left to right every 2 frames
          const lockedChars = Math.floor(frame / 2)

          if (lockedChars >= text.length) {
            setDisplay(text)
            clearInterval(intervalId)
            intervalId = null
            return
          }

          let result = ''
          for (let i = 0; i < text.length; i++) {
            if (i < lockedChars) {
              result += text[i]
            } else if (text[i] === ' ') {
              result += ' '
            } else {
              const randomIndex = Math.floor(Math.random() * GLYPHS.length)
              result += GLYPHS[randomIndex]
            }
          }

          setDisplay(result)
          frame++
        }, speed)
      }, delay)
    }

    if (trigger === 'mount') {
      startScramble()
    } else {
      // Trigger once when 40% of the element enters the viewport
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            observer.disconnect()
            observer = null
            startScramble()
          }
        },
        { threshold: 0.4 }
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
      if (observer) observer.disconnect()
    }
  }, [text, delay, speed, trigger])

  return (
    <Tag ref={containerRef} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Custom Signal HUD crosshair cursor.
 * Features an exact signal-orange center dot and a smoothly lagging outer ring.
 */
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Only enable custom cursor on fine pointers (desktop mouse) without reduced motion
    if (!isFinePointer || prefersReducedMotion) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Hide native cursor and center HUD cursor elements
    document.body.classList.add('has-cursor')
    gsap.set([dot, ring], { opacity: 1, xPercent: -50, yPercent: -50 })

    // quickTo handlers for smooth outer ring physics
    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' })
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' })

    const handlePointerMove = (e) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY })
      setRingX(e.clientX)
      setRingY(e.clientY)
    }

    // Expand ring on interactive clickable targets
    const handlePointerOver = (e) => {
      const isInteractive = Boolean(
        e.target && e.target.closest && e.target.closest('a, button, input, textarea, [data-cursor="hot"]')
      )

      if (isInteractive) {
        gsap.to(ring, {
          scale: 1.8,
          borderColor: '#ff5b1f',
          duration: 0.2,
          overwrite: 'auto',
        })
      } else {
        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(232, 230, 223, 0.6)',
          duration: 0.2,
          overwrite: 'auto',
        })
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerover', handlePointerOver, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerover', handlePointerOver)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      {/* Precision center dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[999] h-1.5 w-1.5 rounded-full bg-signal pointer-events-none opacity-0"
      />
      {/* Lagging outer targeting ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[999] h-9 w-9 rounded-full border border-bone/60 pointer-events-none opacity-0 transition-[border-color]"
      />
    </>
  )
}

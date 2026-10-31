import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// Register ScrollTrigger once with GSAP
gsap.registerPlugin(ScrollTrigger)

/**
 * Custom hook to enable Lenis smooth scrolling and tie it to GSAP's ticker.
 * Shares a single requestAnimationFrame loop with ScrollTrigger.
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Initialize Lenis with smooth wheel scrolling
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    })

    // Update ScrollTrigger whenever Lenis scrolls
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from GSAP's ticker for a unified animation loop
    const tick = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Smoothly scroll internal anchor links (e.g., #about, #projects)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href === '#' || href === '#!') return

      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        lenis.scrollTo(target, { offset: -60 })
      }
    }
    document.addEventListener('click', handleAnchorClick)

    // Refresh ScrollTrigger positions after page loads and layout settles
    const handleLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', handleLoad)
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 800)

    // Cleanup resources on unmount
    return () => {
      document.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('load', handleLoad)
      clearTimeout(refreshTimeout)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}

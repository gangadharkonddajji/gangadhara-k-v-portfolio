import { lazy, Suspense, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { personalInfo, heroContent } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

// Lazy-load HeroScene so Three.js is code-split into its own bundle
const HeroScene = lazy(() => import('./HeroScene'))

/**
 * Signal HUD Hero Section.
 * Features dual-tone typography with decode text, operator portrait with rounded corners,
 * interactive 3D centerpiece, and HUD telemetry.
 */
export default function Hero() {
  const sectionRef = useRef(null)

  // Split name: first word is solid, remainder is outline
  const nameParts = (personalInfo.name || '').trim().split(' ')
  const firstWord = nameParts[0] || 'GANGADHARA'
  const restWords = nameParts.slice(1).join(' ') || 'K V'

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entrance for hero elements
      gsap.fromTo(
        '[data-hero="fade"]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.3,
        }
      )

      // Divider line scaleX wipe from left
      gsap.fromTo(
        '[data-hero="divider"]',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          delay: 0.3,
          transformOrigin: 'left',
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hud-grid relative min-h-screen flex flex-col justify-between overflow-hidden px-5 md:px-10 pt-24 pb-10"
    >
      {/* Main Grid Container — On mobile: 3D sphere + photo first (order-1), then name & buttons (order-2) */}
      <div className="w-full max-w-[1440px] mx-auto my-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-center gap-8 lg:gap-14">
        {/* Left Column: Typography, Narrative, and CTAs (directly under name with no empty gap) */}
        <div className="flex flex-col gap-6 order-2 lg:order-1 text-left">
          {/* Eyebrow */}
          <div data-hero="fade">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold">
              {heroContent.eyebrow}
            </span>
          </div>

          {/* Heading: Dual-tone Name with Decode Effect */}
          <h1
            data-hero="fade"
            className="font-sans text-[clamp(3.2rem,11vw,9.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em]"
          >
            <span className="block text-bone">
              <ScrambleText text={firstWord} trigger="mount" delay={200} />
            </span>
            <span className="block text-transparent [-webkit-text-stroke:1.5px_#e8e6df]">
              <ScrambleText text={restWords} trigger="mount" delay={500} />
            </span>
          </h1>

          {/* Animated Divider */}
          <div
            data-hero="divider"
            className="h-px w-full max-w-xl bg-bone/25 origin-left"
          />

          {/* Role & Intro Narrative — directly under name & divider */}
          <div data-hero="fade" className="flex flex-col gap-2 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal font-semibold">
              {personalInfo.role}
            </span>
            <p className="text-lg md:text-xl text-bone/85 leading-relaxed">
              {heroContent.intro}
            </p>
          </div>

          {/* Action Buttons */}
          <div data-hero="fade" className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={heroContent.ctaPrimary.href}
              className="group flex items-center gap-2.5 bg-signal text-ink px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200 hover:bg-bone hover:text-ink"
            >
              <span>{heroContent.ctaPrimary.label}</span>
              <span
                className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>
            <a
              href={heroContent.ctaSecondary.href}
              className="border border-bone/30 text-bone px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200 hover:border-signal hover:text-signal"
            >
              {heroContent.ctaSecondary.label}
            </a>
          </div>
        </div>

        {/* Right Column: Rotating 3D Sphere with central portrait & orbiting skills (order-1 on mobile) */}
        <div data-hero="fade" className="w-full order-1 lg:order-2 flex justify-center">
          <div className="hud-frame relative border border-bone/10 bg-panel/40 w-full h-[450px] sm:h-[520px] lg:h-[680px] flex items-center justify-center overflow-hidden">
            {/* Lazy 3D WebGL Canvas + Central Portrait + Orbiting Skills */}
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Strip */}
      <div
        data-hero="fade"
        className="w-full max-w-[1440px] mx-auto mt-10 border-t border-bone/10 pt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-dim"
      >
        <div className="flex items-center gap-2.5">
          <span
            className="h-1.5 w-1.5 rounded-full bg-signal inline-block animate-pulse"
            aria-hidden="true"
          />
          <span>{personalInfo.availability}</span>
        </div>
        <span className="hidden sm:inline-block">Scroll ↓</span>
      </div>
    </section>
  )
}

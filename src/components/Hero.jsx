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
      {/* Main Grid Container */}
      <div className="w-full max-w-[1440px] mx-auto my-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-center gap-10 lg:gap-14">
        {/* Left Column: Typography, Portrait, Narrative, and CTAs */}
        <div className="flex flex-col gap-6">
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

          {/* Real Portrait Photo with Rounded Corners just below name */}
          <div data-hero="fade" className="flex items-center gap-4 pt-1">
            <div className="relative w-36 h-44 sm:w-44 sm:h-52 md:w-52 md:h-60 rounded-2xl overflow-hidden border border-bone/25 bg-panel/80 shadow-2xl group shrink-0">
              <img
                src={personalInfo.portrait || '/portrait.jpg'}
                alt={personalInfo.name}
                className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-ink/85 backdrop-blur px-2.5 py-1 rounded-md border border-bone/15 pointer-events-none">
                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-bone font-medium">
                  {personalInfo.name}
                </span>
              </div>
            </div>
          </div>

          {/* Animated Divider */}
          <div
            data-hero="divider"
            className="h-px w-full max-w-xl bg-bone/25 origin-left"
          />

          {/* Role & Intro Narrative */}
          <div data-hero="fade" className="flex flex-col gap-2 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim font-medium">
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

        {/* Right Column: HUD Frame holding 3D Centerpiece */}
        <div data-hero="fade" className="w-full">
          <div className="hud-frame relative border border-bone/10 bg-panel/40 h-[50vh] min-h-[380px] lg:h-[70vh] flex items-center justify-center overflow-hidden">
            {/* Lazy 3D WebGL Canvas */}
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

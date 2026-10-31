import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { aboutContent, skillGroups } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

// Eagerly resolve portrait image assets
const aboutImages = import.meta.glob('../assets/about/*.(png|jpg|jpeg|webp)', {
  eager: true,
  import: 'default',
})

/**
 * About Section.
 * Presents candidate portrait, numerical achievements counter, narrative journey, and skill matrix.
 */
export default function About() {
  const sectionRef = useRef(null)
  const portraitSrc = Object.values(aboutImages)[0] || null

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // 1. Entrance animation (once: true, never hides after appearance)
      gsap.fromTo(
        '[data-about="fade"]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
          },
        }
      )

      // 2. Numerical stats count-up animation
      const statEls = section.querySelectorAll('.stat-number')
      statEls.forEach((el, index) => {
        const targetValue = aboutContent.stats[index]?.value ?? 0

        if (prefersReducedMotion) {
          el.textContent = targetValue
          return
        }

        const counter = { val: 0 }
        gsap.to(counter, {
          val: targetValue,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = Math.round(counter.val)
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full px-5 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Portrait & Numerical Stats (5 cols) */}
        <div data-about="fade" className="flex flex-col gap-6 lg:col-span-5">
          {/* Portrait in HUD frame */}
          <div className="hud-frame relative aspect-[4/5] w-full overflow-hidden border border-bone/10 bg-panel/40">
            <span className="absolute top-3 left-3 z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none">
              IMG // PORTRAIT
            </span>
            <span className="absolute bottom-3 right-3 z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none">
              SYS // 01
            </span>

            {portraitSrc ? (
              <img
                src={portraitSrc}
                alt="Gangadhara K V portrait"
                className="h-full w-full object-cover grayscale opacity-90 transition-all duration-700 hover:grayscale-0 hover:opacity-100 hover:scale-[1.02]"
              />
            ) : (
              <div className="hud-grid flex h-full w-full items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-dim">
                PORTRAIT // NO SIGNAL
              </div>
            )}
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-3 gap-3">
            {aboutContent.stats.map((stat, idx) => (
              <div
                key={`${stat.label}-${idx}`}
                className="flex flex-col justify-between border border-bone/10 bg-panel/40 p-3.5"
              >
                <div className="font-sans text-2xl font-bold tracking-tight text-bone md:text-3xl">
                  <span className="stat-number tabular-nums">0</span>
                  <span className="text-signal">{stat.suffix}</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-dim mt-2 leading-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Narrative & Skill Matrices (7 cols) */}
        <div data-about="fade" className="flex flex-col gap-8 lg:col-span-7">
          <div>
            <ScrambleText
              text={aboutContent.label}
              as="span"
              className="mb-2 block font-mono text-xs font-semibold uppercase tracking-[0.3em] text-signal"
            />
            <h2 className="font-sans text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-bone">
              {aboutContent.heading}
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-relaxed text-bone/80 md:text-lg">
            {aboutContent.paragraph}
          </p>

          {/* Technical Skill Groups */}
          <div className="flex flex-col gap-4 pt-2">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
              Technical Capabilities
            </span>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <div
                  key={group.title}
                  className="flex flex-col gap-3 border border-bone/10 bg-panel/40 p-4"
                >
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
                    {group.title}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="border border-bone/10 bg-ink/50 px-2.5 py-1 font-mono text-xs text-bone/85"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

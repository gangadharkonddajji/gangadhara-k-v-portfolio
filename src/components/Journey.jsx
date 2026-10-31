import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

/**
 * Journey Section.
 * Visualises career and education milestones along a technical vertical timeline
 * featuring a continuous line fill on scroll and reactive milestone nodes.
 */
export default function Journey() {
  const sectionRef = useRef(null)
  const listRef = useRef(null)
  const fillLineRef = useRef(null)

  useEffect(() => {
    const list = listRef.current
    const fill = fillLineRef.current
    if (!list || !fill) return

    const ctx = gsap.context(() => {
      // 1. Continuous timeline fill line animation
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: list,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: true,
          },
        }
      )

      // 2. Milestone items entrance and active state triggers
      const items = list.querySelectorAll('.timeline-item')

      items.forEach((item) => {
        // Fade & slide in once from the right
        gsap.fromTo(
          item,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              once: true,
            },
          }
        )

        // Toggle active status as line fill reaches each node
        ScrollTrigger.create({
          trigger: item,
          start: 'top 65%',
          onEnter: () => item.classList.add('is-on'),
          onLeaveBack: () => item.classList.remove('is-on'),
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="w-full px-5 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* Left: Sticky Section Headline */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <ScrambleText
            text="03 / Journey"
            as="span"
            className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-signal"
          />
          <h2 className="font-sans text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone">
            Where I&apos;ve been learning and building.
          </h2>
        </div>

        {/* Right: Ordered Timeline List */}
        <div className="relative">
          <ol ref={listRef} className="relative flex flex-col gap-16 pl-10 md:gap-24">
            {/* Timeline Base Guide Line */}
            <div
              className="absolute left-[7px] top-2 bottom-2 w-px bg-bone/15"
              aria-hidden="true"
            />
            {/* Animated Signal Fill Line */}
            <div
              ref={fillLineRef}
              className="absolute left-[7px] top-2 bottom-2 w-px origin-top scale-y-0 bg-signal"
              aria-hidden="true"
            />

            {experience.map((entry, index) => (
              <li
                key={`${entry.org}-${index}`}
                className="timeline-item group relative flex flex-col gap-2.5 transition-all duration-300 [&.is-on_.node]:scale-100 [&.is-on_.node]:bg-signal"
              >
                {/* 15px Square Milestone Node centered on the vertical line */}
                <div
                  className="node absolute -left-10 top-1.5 h-[15px] w-[15px] scale-75 border border-signal bg-ink transition-all duration-300"
                  aria-hidden="true"
                />

                {/* Period */}
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim font-medium">
                  {entry.period}
                </span>

                {/* Role */}
                <h3 className="font-sans text-2xl font-bold tracking-tight text-bone md:text-3xl">
                  {entry.role}
                </h3>

                {/* Organization */}
                <span className="font-mono text-sm font-medium text-signal">
                  {entry.org}
                </span>

                {/* Description */}
                <p className="max-w-2xl text-sm leading-relaxed text-bone/70 md:text-base">
                  {entry.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

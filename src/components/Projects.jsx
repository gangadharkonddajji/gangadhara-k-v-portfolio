import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

gsap.registerPlugin(ScrollTrigger)

// Eagerly glob all project image assets
const projectImages = import.meta.glob('../assets/projects/*.(png|jpg|jpeg|webp|svg)', {
  eager: true,
  import: 'default',
})

/**
 * Standard Project Card for multi-project horizontal scroll carousel.
 */
function ProjectCard({ project }) {
  const matchedEntry = Object.entries(projectImages).find(([path]) =>
    path.includes(`/${project.id}.`)
  )
  const coverSrc = project.image || (matchedEntry ? matchedEntry[1] : null)

  return (
    <article
      data-cursor="hot"
      className="group relative flex w-full shrink-0 flex-col justify-between border border-bone/10 bg-panel/60 transition-colors duration-300 hover:border-bone/25 md:w-[min(560px,42vw)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-bone/10 bg-ink md:aspect-[16/8]">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={project.title}
            className="h-full w-full object-cover opacity-85 grayscale transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0"
          />
        ) : (
          <div className="hud-grid flex h-full w-full items-center justify-center font-mono text-xs uppercase tracking-[0.25em] text-dim">
            {project.id} // NO SIGNAL
          </div>
        )}
        <span className="absolute top-3 left-3 z-10 bg-ink/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-signal backdrop-blur-sm">
          {project.number} / {project.year}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-6 p-6 md:p-8">
        <div className="flex flex-col gap-3">
          <h3 className="font-sans text-2xl font-bold tracking-tight text-bone transition-colors group-hover:text-signal md:text-3xl">
            {project.title}
          </h3>
          <p className="text-sm leading-relaxed text-bone/70 md:text-base">
            {project.description}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <a
              href={project.liveUrl || project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-signal px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-bone hover:text-ink"
            >
              Live Demo ↗
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-bone/30 px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-bone transition-colors hover:border-signal hover:text-signal"
            >
              Code ↗
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * Featured Single Project Showcase Layout (activated when only 1 project exists).
 * Displays large image on left, rich metadata/features on right, and an adjacent Coming Soon card.
 */
function FeaturedProjectShowcase({ project }) {
  const matchedEntry = Object.entries(projectImages).find(([path]) =>
    path.includes(`/${project.id}.`)
  )
  const coverSrc = project.image || (matchedEntry ? matchedEntry[1] : null)

  const defaultFeatures = [
    'Force Calculations (F = m · a)',
    'Pressure Analysis (P = F / A)',
    'Power & Work Equations',
    'Dynamic Engineering Unit Conversions',
  ]
  const featuresList = project.features || defaultFeatures

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      {/* Featured Project Card Grid */}
      <article className="border border-bone/15 bg-panel/60 p-6 sm:p-8 lg:p-12 relative overflow-hidden group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Large Project Mockup (7 cols) */}
          <div className="lg:col-span-7">
            <div className="hud-frame relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden border border-bone/15 bg-ink shadow-2xl">
              <span className="absolute top-3 left-3 z-20 bg-ink/85 backdrop-blur px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-signal border border-bone/10">
                FEATURED // {project.number}
              </span>
              <span className="absolute bottom-3 right-3 z-20 bg-ink/85 backdrop-blur px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-dim border border-bone/10">
                {project.year}
              </span>

              {coverSrc ? (
                <img
                  src={coverSrc}
                  alt={project.title}
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <div className="hud-grid flex h-full w-full items-center justify-center font-mono text-xs uppercase tracking-[0.25em] text-dim">
                  {project.id} // NO SIGNAL
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Project Title, Details, Key Features, Tags, and CTAs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal font-semibold">
                  Featured Web Application
                </span>
              </div>
              <h3 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-bone">
                {project.title}
              </h3>
              <p className="text-base text-bone/80 leading-relaxed pt-1">
                {project.description}
              </p>
            </div>

            {/* Key Features List */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-bone/10">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
                Key Technical Features
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 pt-1">
                {featuresList.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-bone/90">
                    <span className="font-mono text-signal font-bold text-xs">›</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags & Action Buttons */}
            <div className="flex flex-col gap-6 pt-3 border-t border-bone/10">
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-bone/15 bg-ink/70 px-3 py-1 font-mono text-xs text-bone/85 tracking-wide"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons: Live Demo and Code */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={project.liveUrl || project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn flex items-center gap-2.5 bg-signal text-ink px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] transition-all hover:bg-bone hover:text-ink shadow-md"
                >
                  <span>Live Demo</span>
                  <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1">
                    ↗
                  </span>
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-bone/30 text-bone px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] transition-all hover:border-signal hover:text-signal"
                >
                  <span>Code</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </article>

      {/* Stylish 'More projects coming soon' Card with Dashed Orange Outline */}
      <div className="border-2 border-dashed border-signal/45 bg-panel/30 hover:border-signal hover:bg-panel/50 transition-all duration-300 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative group">
        <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
          {/* Plus Icon with Glowing Pulse */}
          <div className="w-14 h-14 rounded-full border border-signal/50 bg-signal/10 flex items-center justify-center text-signal text-3xl font-mono shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,91,31,0.25)]">
            +
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
              Pipeline Status // In Development
            </span>
            <h4 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-bone">
              More Projects Coming Soon
            </h4>
            <p className="text-sm text-dim max-w-xl">
              Currently engineering full-stack Python & SQL web applications, REST APIs, and automated tools during TAP Academy placement training.
            </p>
          </div>
        </div>

        <div className="shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-bone/60 border border-bone/15 px-4 py-2 bg-ink/70">
          STAY TUNED →
        </div>
      </div>
    </div>
  )
}

/**
 * Projects Section.
 * Features automatic switching:
 * - If only 1 project exists: Renders clean, full-width featured showcase without sideways scroll.
 * - If multiple projects exist: Re-engages smooth horizontal scroll track with GSAP pinning.
 */
export default function Projects() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)

  const isMultiProject = projects.length > 1

  useEffect(() => {
    if (!isMultiProject) return

    const section = sectionRef.current
    const track = trackRef.current
    const progressBar = progressRef.current
    if (!section || !track) return

    const mm = gsap.matchMedia()

    // Desktop horizontal scroll pinning (only active when multiple projects exist)
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const getScrollDistance = () => {
        const raw = track.scrollWidth - window.innerWidth + 80
        return Math.max(raw, 240)
      }

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBar) {
              gsap.set(progressBar, { scaleX: self.progress })
            }
          },
        },
      })
    })

    return () => mm.revert()
  }, [isMultiProject])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`w-full overflow-hidden px-5 md:px-10 ${
        isMultiProject
          ? 'py-24 md:flex md:h-screen md:flex-col md:justify-center md:py-0 md:pt-20 md:pb-6'
          : 'py-24 md:py-36'
      }`}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Header Row */}
        <div className="mb-8 flex w-full shrink-0 flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <ScrambleText
              text="02 / Selected work"
              as="span"
              className="mb-2 block font-mono text-xs font-semibold uppercase tracking-[0.3em] text-signal"
            />
            <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.03em] text-bone">
              Projects
            </h2>
          </div>

          {/* Header Status Tag: Only displays 'scroll →' when multiple projects exist */}
          {isMultiProject ? (
            <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-dim md:block">
              {projects.length} projects · scroll →
            </span>
          ) : (
            <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-dim md:block">
              1 Featured Release // More Coming Soon
            </span>
          )}
        </div>

        {/* Content Body */}
        {isMultiProject ? (
          /* Multi-Project Horizontal Track */
          <div className="w-full overflow-x-hidden md:overflow-visible">
            <div
              ref={trackRef}
              className="flex flex-col gap-6 md:w-max md:flex-row md:gap-8"
            >
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        ) : (
          /* Single Featured Project Showcase + Coming Soon Card */
          <FeaturedProjectShowcase project={projects[0]} />
        )}

        {/* Bottom Horizontal Scroll Progress Line (only active when multiple projects exist) */}
        {isMultiProject && (
          <div className="mt-8 hidden w-full shrink-0 md:block">
            <div className="h-0.5 w-full overflow-hidden bg-bone/10">
              <div
                ref={progressRef}
                className="h-full w-full origin-left scale-x-0 bg-signal"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
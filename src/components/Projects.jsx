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
 * Single Project Card.
 * Displays project cover with hover zoom/color shift, tags, and action links.
 */
function ProjectCard({ project }) {
  // Find matching image by project id (e.g. 'project-1' -> '../assets/projects/project-1.png')
  const matchedEntry = Object.entries(projectImages).find(([path]) =>
    path.includes(`/${project.id}.`)
  )
  const coverSrc = matchedEntry ? matchedEntry[1] : null

  return (
    <article
      data-cursor="hot"
      className="group relative flex w-full shrink-0 flex-col justify-between border border-bone/10 bg-panel/60 transition-colors duration-300 hover:border-bone/25 md:w-[min(560px,42vw)]"
    >
      {/* Top Cover Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-bone/10 bg-ink md:aspect-[16/8]">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={project.title}
            className="h-full w-full object-cover opacity-80 grayscale transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0"
          />
        ) : (
          <div className="hud-grid flex h-full w-full items-center justify-center font-mono text-xs uppercase tracking-[0.25em] text-dim">
            {project.id} // NO SIGNAL
          </div>
        )}

        {/* Top-Left Metadata Badge */}
        <span className="absolute top-3 left-3 z-10 bg-ink/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-signal backdrop-blur-sm">
          {project.number} / {project.year}
        </span>
      </div>

      {/* Card Content Body */}
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
          {/* Tags */}
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

          {/* Action Links */}
          <div className="flex items-center gap-3 pt-1">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-signal px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-bone hover:text-ink"
              >
                Live ↗
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-bone/30 px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-bone transition-colors hover:border-signal hover:text-signal"
              >
                Code ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * Projects Section.
 * Implements horizontal scroll pinning on desktop and stacked list on mobile.
 */
export default function Projects() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const progressBar = progressRef.current
    if (!section || !track) return

    const mm = gsap.matchMedia()

    // Desktop horizontal scroll pinning (disabled with reduced motion)
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
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full overflow-hidden py-24 md:flex md:h-screen md:flex-col md:justify-center md:py-0 md:pt-20 md:pb-6"
    >
      {/* Header Row */}
      <div className="mx-auto mb-8 flex w-full max-w-[1440px] shrink-0 flex-col gap-4 px-5 md:mb-12 md:flex-row md:items-end md:justify-between md:px-10">
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
        <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-dim md:block">
          {projects.length} {projects.length === 1 ? 'project' : 'projects'} · scroll →
        </span>
      </div>

      {/* Cards Track: flex-col on mobile, flex-row on desktop */}
      <div className="w-full overflow-x-hidden md:overflow-visible">
        <div
          ref={trackRef}
          className="flex flex-col gap-6 px-5 md:w-max md:flex-row md:gap-8 md:px-10"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Bottom Horizontal Scroll Progress Line (md+ only) */}
      <div className="mx-auto mt-8 hidden w-full max-w-[1440px] shrink-0 px-5 md:block md:px-10">
        <div className="h-0.5 w-full overflow-hidden bg-bone/10">
          <div
            ref={progressRef}
            className="h-full w-full origin-left scale-x-0 bg-signal"
          />
        </div>
      </div>
    </section>
  )
}

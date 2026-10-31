import { useEffect, useState, useMemo } from 'react'
import { personalInfo, navLinks, heroContent } from '../data/portfolioData'

/**
 * Signal HUD Top Navigation Bar.
 * Transparent at page top, becomes blurred translucent dark panel with bottom border on scroll.
 */
export default function Hud() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)
  const [timeString, setTimeString] = useState('')

  // Derive initials from brand name (e.g. "Gangadhara K V" -> "GKV")
  const initials = useMemo(() => {
    if (!personalInfo?.brandName) return 'HUD'
    return personalInfo.brandName
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .join('')
  }, [])

  const statusLines = useMemo(() => heroContent?.statusLines || [], [])

  // 1. Scroll listener for sticky HUD background shift
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 2. Status line rotation interval (every 3.5s)
  useEffect(() => {
    if (!statusLines.length) return

    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusLines.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [statusLines.length])

  // 3. Live 24-hour timezone clock (every 1s)
  useEffect(() => {
    const tz = personalInfo.timezone || 'Asia/Kolkata'

    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-GB', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date())
        setTimeString(formatted)
      } catch {
        setTimeString(new Date().toLocaleTimeString('en-GB', { hour12: false }))
      }
    }

    updateClock()
    const clockInterval = setInterval(updateClock, 1000)
    return () => clearInterval(clockInterval)
  }, [])

  const isSolid = isScrolled || mobileMenuOpen

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 transition-all duration-300 ${
        isSolid
          ? 'bg-ink/80 backdrop-blur-md border-b border-bone/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 md:px-10">
        {/* Left: Brand / Initials Badge */}
        <a
          href="#home"
          className="group flex items-center gap-3.5 focus:outline-none"
          aria-label={`${personalInfo.name} - Return to top`}
        >
          <div className="flex h-8 w-8 items-center justify-center border border-signal font-mono text-xs font-semibold text-signal transition-transform duration-200 group-hover:scale-105">
            {initials}
          </div>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors group-hover:text-signal sm:inline-block">
            {personalInfo.brandName}
          </span>
        </a>

        {/* Centre: Rotating Status Indicator (lg+) */}
        {statusLines.length > 0 && (
          <div
            className="hidden items-center gap-2.5 lg:flex"
            aria-live="polite"
            aria-atomic="true"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse"
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim transition-opacity duration-300">
              {statusLines[statusIndex]}
            </span>
          </div>
        )}

        {/* Right: Desktop Navigation & Live Clock (md+) */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          <nav className="flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-bone/70 transition-colors hover:text-signal"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div
            className="border-l border-bone/10 pl-6 lg:pl-8"
            title={`Timezone: ${personalInfo.timezone}`}
          >
            <span className="font-mono text-xs tracking-wider tabular-nums text-dim">
              {timeString}
            </span>
          </div>
        </div>

        {/* Mobile: Menu Toggle Button (below md) */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
            className="font-mono text-xs uppercase tracking-[0.18em] text-bone hover:text-signal transition-colors focus:outline-none py-2"
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Mobile: Full Dropdown Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="fixed inset-x-0 top-16 bg-ink/95 backdrop-blur-xl border-b border-bone/10 px-6 py-6 flex flex-col md:hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <nav className="flex flex-col" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-bone/10 py-4 font-sans text-2xl font-semibold text-bone hover:text-signal transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-6 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-dim">
            <span>{personalInfo.city}</span>
            <span className="tabular-nums" title={`Timezone: ${personalInfo.timezone}`}>
              {timeString}
            </span>
          </div>
        </div>
      )}
    </header>
  )
}

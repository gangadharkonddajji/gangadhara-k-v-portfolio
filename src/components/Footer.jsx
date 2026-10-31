import { personalInfo, socialLinks, navLinks, footerContent, academy } from '../data/portfolioData'

const currentYear = new Date().getFullYear()

/**
 * Signal HUD Footer component.
 * Features 3-column site navigation, faint brand name watermark, and placement training credits.
 */
export default function Footer() {
  // Filter out any blank social link URLs
  const activeSocials = Object.entries(socialLinks || {}).filter(
    ([, url]) => Boolean(url && url.trim())
  )

  const socialLabels = {
    github: 'GitHub ↗',
    linkedin: 'LinkedIn ↗',
    instagram: 'Instagram ↗',
  }

  return (
    <footer className="w-full overflow-hidden border-t border-bone/10 px-5 pt-16 pb-8 md:px-10">
      <div className="mx-auto max-w-[1440px]">
        {/* Top 3-Column Navigation Grid */}
        <div className="mb-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* Column 1: Navigate */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-signal">
              Navigate
            </span>
            <nav className="flex flex-col gap-2.5" aria-label="Footer Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-fit font-sans text-sm text-bone/75 transition-colors hover:text-signal"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 2: Elsewhere (Social Links) */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-signal">
              Elsewhere
            </span>
            <div className="flex flex-col gap-2.5">
              {activeSocials.map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit font-sans text-sm text-bone/75 transition-colors hover:text-signal"
                >
                  {socialLabels[platform] || `${platform.toUpperCase()} ↗`}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Say Hello */}
          <div className="flex flex-col gap-3 md:items-end md:text-right">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-signal">
              Say hello
            </span>
            <div className="flex flex-col gap-2 md:items-end">
              <a
                href={`mailto:${personalInfo.email}`}
                className="w-fit break-all font-sans text-sm text-bone/75 transition-colors hover:text-signal"
              >
                {personalInfo.email}
              </a>
              <span className="font-mono text-xs text-dim">
                {personalInfo.city}
              </span>
            </div>
          </div>
        </div>

        {/* Brand Name Huge Faint Watermark */}
        <div
          aria-hidden="true"
          className="my-4 overflow-hidden text-center select-none pointer-events-none md:my-8"
        >
          <span className="block whitespace-nowrap font-sans text-[13.5vw] font-bold uppercase leading-none tracking-[-0.05em] text-bone/[0.07]">
            {personalInfo.brandName}
          </span>
        </div>

        {/* Bottom Metadata & Credit Row */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-bone/10 pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-dim md:flex-row">
          <div>
            © {currentYear} {personalInfo.name} · {footerContent.tagline}
          </div>

          <div>
            Trained at{' '}
            <a
              href={academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone/85 underline decoration-bone/30 underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
            >
              {academy.name}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

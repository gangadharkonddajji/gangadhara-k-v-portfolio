import { useEffect, useRef, useState } from 'react'
import { personalInfo, socialLinks, contactContent, emailjsConfig } from '../data/portfolioData'
import ScrambleText from './ScrambleText'

/**
 * Signal HUD Contact Section.
 * Features an editorial direct contact column and a retro terminal-styled dispatch form.
 */
export default function Contact() {
  const formRef = useRef(null)
  const statusTimeoutRef = useRef(null)

  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'success' | 'error', text: string } | null

  // Extract first name for the terminal command line
  const firstName = (personalInfo.name || '').trim().split(' ')[0].toLowerCase() || 'gangadhara'

  // Filter out any blank or skipped social URLs
  const activeSocials = Object.entries(socialLinks || {}).filter(
    ([, url]) => Boolean(url && url.trim())
  )

  const socialLabels = {
    github: 'GitHub ↗',
    linkedin: 'LinkedIn ↗',
    instagram: 'Instagram ↗',
  }

  // Clear any existing status timeout on unmount
  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current)
      }
    }
  }, [])

  const setTimedStatus = (statusObj) => {
    setStatus(statusObj)
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current)
    }
    statusTimeoutRef.current = setTimeout(() => {
      setStatus(null)
    }, 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = formRef.current
    if (!form) return

    const formData = new FormData(form)
    const name = formData.get('user_name') || ''
    const email = formData.get('user_email') || ''
    const message = formData.get('message') || ''

    // Verify if live EmailJS credentials are provided
    const isConfigured = Boolean(
      emailjsConfig.serviceId &&
        emailjsConfig.serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
        emailjsConfig.templateId &&
        emailjsConfig.templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
        emailjsConfig.publicKey &&
        emailjsConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY'
    )

    if (!isConfigured) {
      // Fallback: Open mailto link with pre-filled subject and body
      const subject = encodeURIComponent('Portfolio contact')
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )
      window.open(
        `mailto:${personalInfo.email}?subject=${subject}&body=${body}`,
        '_blank'
      )

      setTimedStatus({
        type: 'success',
        text: '✓ Message sent. Talk soon.',
      })
      form.reset()
      return
    }

    // Configured EmailJS delivery
    setIsSending(true)
    try {
      const emailjs = await import('@emailjs/browser')
      await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        form,
        emailjsConfig.publicKey
      )

      setTimedStatus({
        type: 'success',
        text: '✓ Message sent. Talk soon.',
      })
      form.reset()
    } catch (err) {
      console.error('EmailJS error:', err)
      setTimedStatus({
        type: 'error',
        text: '✕ Something went wrong. Please try again.',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section
      id="contact"
      className="hud-grid w-full px-5 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Left Column: Direct Outreach & Social Links */}
        <div className="flex flex-col gap-8">
          <div>
            <ScrambleText
              text={contactContent.label}
              as="span"
              className="mb-2 block font-mono text-xs font-semibold uppercase tracking-[0.3em] text-signal"
            />
            <h2 className="font-sans text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.04em] text-bone">
              {contactContent.heading}
            </h2>
          </div>

          <p className="max-w-md text-lg leading-relaxed text-bone/70">
            {contactContent.note}
          </p>

          <div className="flex flex-col gap-3 pt-2">
            {/* Primary Email Mailto */}
            <a
              href={`mailto:${personalInfo.email}`}
              className="w-fit break-all font-mono text-lg font-medium text-bone underline decoration-signal decoration-2 underline-offset-8 transition-colors hover:text-signal md:text-2xl"
            >
              {personalInfo.email}
            </a>

            {/* Optional Phone */}
            {personalInfo.phone && (
              <a
                href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
                className="w-fit font-mono text-sm text-dim transition-colors hover:text-bone"
              >
                {personalInfo.phone}
              </a>
            )}
          </div>

          {/* Social Profiles */}
          {activeSocials.length > 0 && (
            <div className="flex flex-wrap items-center gap-6 pt-4">
              {activeSocials.map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-bone/70 transition-colors hover:text-signal"
                >
                  {socialLabels[platform] || `${platform.toUpperCase()} ↗`}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Terminal-Style Dispatch Form */}
        <div className="hud-frame relative border border-bone/10 bg-ink/70 p-6 backdrop-blur-md md:p-10">
          {/* CLI Prompt Header */}
          <div className="mb-8 flex items-center gap-2 font-mono text-xs text-dim">
            <span className="text-signal">$</span>
            <span>new message --to {firstName}</span>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-7"
          >
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-name"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold"
              >
                &gt; name
              </label>
              <input
                id="contact-name"
                name="user_name"
                type="text"
                required
                placeholder="Your full name"
                className="w-full rounded-none border-b border-bone/20 bg-transparent px-0 py-2 font-mono text-sm text-bone placeholder:text-dim/50 outline-none transition-colors focus:border-signal"
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-email"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold"
              >
                &gt; email
              </label>
              <input
                id="contact-email"
                name="user_email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-none border-b border-bone/20 bg-transparent px-0 py-2 font-mono text-sm text-bone placeholder:text-dim/50 outline-none transition-colors focus:border-signal"
              />
            </div>

            {/* Message Textarea */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-message"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold"
              >
                &gt; message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about the role or project…"
                className="w-full resize-none rounded-none border-b border-bone/20 bg-transparent px-0 py-2 font-mono text-sm text-bone placeholder:text-dim/50 outline-none transition-colors focus:border-signal"
              />
            </div>

            {/* Full-width Square Submit Button */}
            <button
              type="submit"
              disabled={isSending}
              className="group flex w-full items-center justify-between bg-signal px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-all hover:bg-bone hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{isSending ? 'Sending…' : 'Send message'}</span>
              <span
                className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </button>

            {/* Feedback Status Line */}
            <div className="min-h-[1.25rem]">
              {status && (
                <p
                  role="status"
                  className={`font-mono text-xs tracking-wider ${
                    status.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {status.text}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

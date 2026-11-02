import React from 'react'

/**
 * Centered single-column shell for the logged-out screens. Deliberately calm and narrow —
 * the first impression of a financial tool should read as trustworthy, not busy.
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#022d2a] bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_30%),linear-gradient(180deg,#022d2a_0%,#021c1a_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[760px] items-center justify-center px-4 py-10">
        <div className="w-full">
          <div className="text-center">
            <img src="/logo.svg" alt="LipaHaraka logo" className="mx-auto h-28 w-auto md:h-36" />
            {title && <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>}
            {subtitle && <p className="mt-4 text-base text-emerald-50/80 md:text-lg">{subtitle}</p>}
          </div>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}

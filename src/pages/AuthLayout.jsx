import React from 'react'

/**
 * Centered single-column shell for the logged-out screens. Deliberately calm and narrow —
 * the first impression of a financial tool should read as trustworthy, not busy.
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-ink-700 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="font-serif text-3xl text-white tracking-tight">LipaHaraka</span>
            <p className="text-ink-100 text-sm mt-1">Invoicing and cash flow for Kenyan SMEs</p>
          </div>
          <div className="card p-6 md:p-8">
            <h1 className="text-xl font-semibold mb-1">{title}</h1>
            {subtitle && <p className="text-muted text-sm mb-6">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

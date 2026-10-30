import React from 'react'

// Small, deliberately plain line icons — no external icon library, kept to the exact set
// the nav needs so the bundle stays light for the "modest Android device" usability target.
const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const IconDashboard = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
)
export const IconInvoice = (p) => (
  <svg {...base} {...p}><path d="M6 3h9l3 3v15H6z" /><path d="M9 9h6M9 13h6M9 17h4" /></svg>
)
export const IconAdvance = (p) => (
  <svg {...base} {...p}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
)
export const IconBusiness = (p) => (
  <svg {...base} {...p}><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01" /></svg>
)
export const IconAdmin = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
)
export const IconLogout = (p) => (
  <svg {...base} {...p}><path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>
)
export const IconSettings = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="2.8" />
    <path d="M12 2.5v2.6M12 18.9v2.6M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2.5 12h2.6M18.9 12h2.6M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    <path d="M7.5 7.5l1.7 1.7M14.8 14.8l1.7 1.7M16.5 7.5l-1.7 1.7M9.2 14.8l-1.7 1.7" />
  </svg>
)
export const IconPlus = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const IconArrowLeft = (p) => (
  <svg {...base} {...p}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
)

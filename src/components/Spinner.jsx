import React from 'react'

export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-2.5 text-muted text-sm py-8 justify-center" role="status">
      <span className="h-3.5 w-3.5 rounded-full border-2 border-ink-300 border-t-ink-700 animate-spin" />
      {label}
    </div>
  )
}

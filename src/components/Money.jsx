import React from 'react'

const formatter = new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Renders a currency amount in the ledger serif treatment. Pass size to bump the type scale. */
export default function Money({ value, size = 'base', className = '' }) {
  const sizeClass = { base: 'text-base', lg: 'text-xl', xl: 'stat-value' }[size] || 'text-base'
  const amount = Number(value ?? 0)
  return (
    <span className={`amount ${sizeClass} ${className}`}>
      <span className="text-muted text-[0.7em] align-top mr-0.5">KES</span>
      {formatter.format(amount)}
    </span>
  )
}

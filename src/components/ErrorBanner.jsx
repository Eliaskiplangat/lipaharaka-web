import React from 'react'

/** A single, plainly-worded error message. Never vague, never apologetic — see the field
 *  violation list underneath when the backend's validation returns more than one problem. */
export default function ErrorBanner({ error }) {
  if (!error) return null
  const message = typeof error === 'string' ? error : error.message
  const violations = typeof error === 'string' ? [] : error.violations || []

  return (
    <div className="border border-danger-500 bg-danger-100 text-danger-600 rounded px-4 py-3 text-sm">
      <p className="font-medium">{message}</p>
      {violations.length > 0 && (
        <ul className="mt-1.5 list-disc list-inside space-y-0.5">
          {violations.map((v, i) => (
            <li key={i}>{v.field}: {v.message}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

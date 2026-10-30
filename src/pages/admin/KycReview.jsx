import React, { useEffect, useState } from 'react'
import { adminApi } from '../../api/admin'
import Spinner from '../../components/Spinner'
import ErrorBanner from '../../components/ErrorBanner'

export default function KycReview() {
  const [businesses, setBusinesses] = useState(undefined)
  const [error, setError] = useState(null)
  const [activeBusinessId, setActiveBusinessId] = useState(null)

  function reload() {
    adminApi.listPendingKyc({ size: 100 }).then((page) => setBusinesses(page.content)).catch(setError)
  }

  useEffect(reload, [])

  if (error) return <ErrorBanner error={error} />
  if (businesses === undefined) return <Spinner label="Loading pending KYC submissions" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-1">KYC review</h1>
        <p className="text-muted text-sm">Businesses awaiting verification, oldest first.</p>
      </div>

      {businesses.length === 0 ? (
        <p className="text-muted text-sm py-10 text-center">Nothing pending review.</p>
      ) : (
        <div className="space-y-3">
          {businesses.map((b) => (
            <BusinessReviewCard
              key={b.id}
              business={b}
              expanded={activeBusinessId === b.id}
              onToggle={() => setActiveBusinessId(activeBusinessId === b.id ? null : b.id)}
              onDecided={() => {
                setActiveBusinessId(null)
                reload()
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BusinessReviewCard({ business, expanded, onToggle, onDecided }) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState(null) // 'approve' | 'reject'

  async function submit(approve) {
    if (!approve && !reason.trim()) {
      setError({ message: 'A reason is required when rejecting a submission.' })
      setMode('reject')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await adminApi.reviewKyc(business.id, { approve, reason: reason || null })
      onDecided()
    } catch (err) {
      setError(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card p-5">
      <button onClick={onToggle} className="w-full flex items-center justify-between text-left">
        <div>
          <p className="font-medium text-sm">{business.name}</p>
          <p className="text-muted text-xs mt-0.5">KRA PIN {business.kraPin} · {business.sector || 'Sector not specified'}</p>
        </div>
        <span className="text-muted text-sm">{expanded ? 'Hide' : 'Review'}</span>
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-line space-y-3">
          <ErrorBanner error={error} />
          <div>
            <label className="field-label" htmlFor={`reason-${business.id}`}>Reason (required to reject)</label>
            <textarea
              id={`reason-${business.id}`}
              rows={2}
              className="field-input"
              placeholder="e.g. National ID copy is illegible"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => submit(true)} disabled={submitting} className="btn-primary flex-1">
              Approve
            </button>
            <button onClick={() => submit(false)} disabled={submitting} className="btn-secondary flex-1 border-danger-500 text-danger-600 hover:bg-danger-100">
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

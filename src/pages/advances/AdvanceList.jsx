import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { advanceApi } from '../../api/advances'
import Money from '../../components/Money'
import StatusBadge from '../../components/StatusBadge'
import Spinner from '../../components/Spinner'
import ErrorBanner from '../../components/ErrorBanner'

export default function AdvanceList() {
  const [advances, setAdvances] = useState(undefined)
  const [error, setError] = useState(null)

  useEffect(() => {
    advanceApi.list({ size: 100 }).then((page) => setAdvances(page.content)).catch(setError)
  }, [])

  if (error) return <ErrorBanner error={error} />
  if (advances === undefined) return <Spinner label="Loading advances" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-1">Advances</h1>
        <p className="text-muted text-sm">
          Cash advances requested against your invoices. To request a new one, open an eligible
          sent or overdue invoice and use "Get paid early".
        </p>
      </div>

      {advances.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-medium mb-1">No advances yet</p>
          <p className="text-muted text-sm mb-4">Request an advance from any sent or overdue invoice.</p>
          <Link to="/invoices" className="btn-secondary inline-flex">View invoices</Link>
        </div>
      ) : (
        <div className="card divide-y divide-line">
          {advances.map((a) => (
            <Link
              key={a.id}
              to={`/invoices/${a.invoiceId}`}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-ink-50 transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{a.invoiceNumber}</p>
                <p className="text-muted text-xs mt-0.5">
                  Requested {new Date(a.requestedAt).toLocaleDateString()} · fee <Money value={a.feeAmount} />
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Money value={a.netPayout} />
                <StatusBadge status={a.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { invoiceApi } from '../../api/invoices'
import Money from '../../components/Money'
import StatusBadge from '../../components/StatusBadge'
import Spinner from '../../components/Spinner'
import ErrorBanner from '../../components/ErrorBanner'
import { IconPlus } from '../../components/icons'

const FILTERS = ['ALL', 'DRAFT', 'SENT', 'OVERDUE', 'PAID']

export default function InvoiceList() {
  const [invoices, setInvoices] = useState(undefined)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    invoiceApi
      .list({ size: 100 })
      .then((page) => setInvoices(page.content))
      .catch(setError)
  }, [])

  if (error) return <ErrorBanner error={error} />
  if (invoices === undefined) return <Spinner label="Loading invoices" />

  const filtered = filter === 'ALL' ? invoices : invoices.filter((i) => i.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Invoices</h1>
        <Link to="/invoices/new" className="btn-primary">
          <IconPlus width={16} height={16} /> New invoice
        </Link>
      </div>

      <div className="flex gap-1 border-b border-line">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 text-sm border-b-2 -mb-px transition-colors ${
              filter === f ? 'border-ink-700 text-ink-700 font-medium' : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted text-sm py-10 text-center">No invoices in this view.</p>
      ) : (
        <div className="card divide-y divide-line">
          {filtered.map((inv) => (
            <Link
              key={inv.id}
              to={`/invoices/${inv.id}`}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-ink-50 transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{inv.invoiceNumber}</p>
                <p className="text-muted text-xs mt-0.5">{inv.buyerName} · issued {inv.issueDate} · due {inv.dueDate}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <Money value={inv.totalAmount} />
                  {Number(inv.outstandingBalance) > 0 && Number(inv.outstandingBalance) !== Number(inv.totalAmount) && (
                    <p className="text-xs text-muted">
                      <Money value={inv.outstandingBalance} /> outstanding
                    </p>
                  )}
                </div>
                <StatusBadge status={inv.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { invoiceApi } from '../api/invoices'
import { businessApi } from '../api/business'
import Money from '../components/Money'
import StatusBadge from '../components/StatusBadge'
import Spinner from '../components/Spinner'
import ErrorBanner from '../components/ErrorBanner'
import { IconPlus } from '../components/icons'

export default function Dashboard() {
  const { user } = useAuth()
  const [business, setBusiness] = useState(undefined)
  const [invoices, setInvoices] = useState(undefined)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      businessApi.getMine().catch((err) => (err.status === 404 ? null : Promise.reject(err))),
      invoiceApi.list({ size: 100 }),
    ])
      .then(([b, invoicePage]) => {
        setBusiness(b)
        setInvoices(invoicePage.content)
      })
      .catch(setError)
  }, [])

  if (error) return <ErrorBanner error={error} />
  if (invoices === undefined) return <Spinner label="Loading overview" />

  const outstanding = invoices
    .filter((i) => i.status === 'SENT' || i.status === 'OVERDUE')
    .reduce((sum, i) => sum + Number(i.outstandingBalance), 0)
  const overdueCount = invoices.filter((i) => i.status === 'OVERDUE').length
  const paidThisMonth = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((sum, i) => sum + Number(i.totalAmount), 0)
  const firstName = user?.fullName?.split(' ')[0] || 'there'

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Welcome back</p>
          <h1 className="mt-1 text-2xl text-charcoal">Hi {firstName}</h1>
        </div>
        <Link to="/invoices/new" className="btn-primary w-full md:w-auto">
          <IconPlus width={16} height={16} /> Create invoice
        </Link>
      </header>

      {business && business.kycStatus !== 'APPROVED' && (
        <div className="flex flex-col gap-3 rounded border border-gold-500 bg-gold-100 px-4 py-3 text-sm text-gold-600 md:flex-row md:items-center md:justify-between">
          <span>Complete your business verification to unlock invoicing and cash advances.</span>
          <Link to="/business" className="font-medium underline">Complete setup</Link>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(260px,1.2fr)] lg:gap-5">
        <div className="space-y-5">
          <section className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Outstanding" value={<Money value={outstanding} size="xl" />} />
            <StatCard label="Overdue" value={<span className="stat-value">{overdueCount}</span>} tone={overdueCount > 0 ? 'text-danger-500' : undefined} />
            <StatCard label="Collected" value={<Money value={paidThisMonth} size="xl" />} />
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Recent activity</h2>
              <Link to="/invoices" className="text-sm text-ink-700 hover:underline">View all</Link>
            </div>

            {invoices.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="card divide-y divide-line">
                {invoices.slice(0, 6).map((inv) => (
                  <Link
                    key={inv.id}
                    to={`/invoices/${inv.id}`}
                    className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-ink-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-charcoal">{inv.invoiceNumber}</p>
                      <p className="text-xs text-muted">{inv.buyerName} · due {inv.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Money value={inv.totalAmount} />
                      <StatusBadge status={inv.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="mt-5 space-y-5 lg:mt-0">
          <div className="card p-5">
            <h2 className="text-base font-semibold">Quick actions</h2>
            <div className="mt-4 space-y-2">
              <Link to="/invoices/new" className="btn-secondary w-full justify-between">
                <span>Create invoice</span>
                <span>→</span>
              </Link>
              <Link to="/invoices" className="btn-secondary w-full justify-between">
                <span>Review invoices</span>
                <span>→</span>
              </Link>
              <Link to="/business" className="btn-secondary w-full justify-between">
                <span>Business details</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-base font-semibold">What needs attention</h2>
            <ul className="mt-4 space-y-3 text-sm text-charcoal">
              <li className="flex items-start justify-between gap-3 border-b border-line pb-2 last:border-0 last:pb-0">
                <span className="text-muted">KYC</span>
                <span className={business?.kycStatus === 'APPROVED' ? 'text-success-500' : 'text-gold-600'}>
                  {business?.kycStatus || 'Pending'}
                </span>
              </li>
              <li className="flex items-start justify-between gap-3 border-b border-line pb-2 last:border-0 last:pb-0">
                <span className="text-muted">Overdue</span>
                <span className="font-medium text-charcoal">{overdueCount}</span>
              </li>
              <li className="flex items-start justify-between gap-3">
                <span className="text-muted">Outstanding</span>
                <span className="font-medium text-charcoal"><Money value={outstanding} /></span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

function StatCard({ label, value, tone }) {
  return (
    <div className="card p-5">
      <p className="mb-2 text-sm text-muted">{label}</p>
      <div className={tone}>{value}</div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="card p-10 text-center">
      <p className="mb-1 text-base font-medium text-charcoal">No invoices yet</p>
      <p className="mb-4 text-sm text-muted">Create your first invoice to start getting paid faster.</p>
      <Link to="/invoices/new" className="btn-primary inline-flex">
        <IconPlus width={16} height={16} /> Create invoice
      </Link>
    </div>
  )
}

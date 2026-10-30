import React, { useEffect, useState } from 'react'
import { adminApi } from '../../api/admin'
import Money from '../../components/Money'
import Spinner from '../../components/Spinner'
import ErrorBanner from '../../components/ErrorBanner'

export default function AdminDashboard() {
  const [kpis, setKpis] = useState(undefined)
  const [error, setError] = useState(null)

  useEffect(() => {
    adminApi.getKpis().then(setKpis).catch(setError)
  }, [])

  if (error) return <ErrorBanner error={error} />
  if (kpis === undefined) return <Spinner label="Loading platform KPIs" />

  return (
    <div className="space-y-8">
      <h1 className="text-2xl">Platform KPIs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total invoiced" value={<Money value={kpis.totalInvoiced} size="xl" />} />
        <StatCard label="Total collected" value={<Money value={kpis.totalCollected} size="xl" />} />
        <StatCard label="Total advanced to SMEs" value={<Money value={kpis.totalAdvanced} size="xl" />} />
        <StatCard label="Total invoices" value={<span className="stat-value">{kpis.totalInvoiceCount}</span>} />
        <StatCard label="Overdue invoices" value={<span className="stat-value">{kpis.overdueInvoiceCount}</span>} tone={kpis.overdueInvoiceCount > 0 ? 'text-danger-500' : undefined} />
        <StatCard label="Overdue rate" value={<span className="stat-value">{kpis.overdueRatePercent}%</span>} />
      </div>
    </div>
  )
}

function StatCard({ label, value, tone }) {
  return (
    <div className="card p-5">
      <p className="text-muted text-sm mb-1">{label}</p>
      <div className={tone}>{value}</div>
    </div>
  )
}

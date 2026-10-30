import React from 'react'

const CLASS_BY_STATUS = {
  DRAFT: 'badge-draft',
  SENT: 'badge-sent',
  OVERDUE: 'badge-overdue',
  PAID: 'badge-paid',
  CANCELLED: 'badge-cancelled',
  PENDING: 'badge-draft',
  APPROVED: 'badge-paid',
  REJECTED: 'badge-overdue',
  REQUESTED: 'badge-sent',
  DISBURSED: 'badge-paid',
  REPAID: 'badge-paid',
}

export default function StatusBadge({ status }) {
  const cls = CLASS_BY_STATUS[status] || 'badge-draft'
  return <span className={cls}>{status?.replace('_', ' ')}</span>
}

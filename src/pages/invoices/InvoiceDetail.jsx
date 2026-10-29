import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { invoiceApi } from '../../api/invoices'
import { advanceApi } from '../../api/advances'
import Money from '../../components/Money'
import StatusBadge from '../../components/StatusBadge'
import Spinner from '../../components/Spinner'
import ErrorBanner from '../../components/ErrorBanner'
import { IconArrowLeft } from '../../components/icons'

export default function InvoiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(undefined)
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState(false)

  function reload() {
    invoiceApi.get(id).then(setInvoice).catch(setError)
  }

  useEffect(reload, [id])

  if (error) return <ErrorBanner error={error} />
  if (invoice === undefined) return <Spinner label="Loading invoice" />

  const payLink = `${window.location.origin}/pay/${invoice.shareableToken}`
  const isEligibleForAdvance = invoice.status === 'SENT' || invoice.status === 'OVERDUE'

  async function handleSend() {
    setSending(true)
    setError(null)
    try {
      const updated = await invoiceApi.send(invoice.id)
      setInvoice(updated)
    } catch (err) {
      setError(err)
    } finally {
      setSending(false)
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(payLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link to="/invoices" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal">
        <IconArrowLeft width={16} height={16} /> Back to invoices
      </Link>

      <ErrorBanner error={error} />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl mb-1">{invoice.invoiceNumber}</h1>
          <p className="text-muted text-sm">
            Billed to {invoice.buyerName} · issued {invoice.issueDate} · due {invoice.dueDate}
          </p>
        </div>
        <StatusBadge status={invoice.status} />
      </div>

      {invoice.status === 'DRAFT' && (
        <div className="border border-line bg-ink-50 rounded px-4 py-3 flex items-center justify-between text-sm">
          <span>This invoice hasn't been sent to the buyer yet.</span>
          <button onClick={handleSend} disabled={sending} className="btn-primary shrink-0 ml-4">
            {sending ? 'Sending…' : 'Send invoice'}
          </button>
        </div>
      )}

      {invoice.status !== 'DRAFT' && invoice.status !== 'CANCELLED' && (
        <div className="border border-line rounded px-4 py-3 text-sm">
          <p className="font-medium mb-1.5">Payment link</p>
          <div className="flex items-center gap-2">
            <input readOnly className="field-input text-xs" value={payLink} />
            <button onClick={handleCopyLink} className="btn-secondary shrink-0 text-xs px-3">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      <div className="card p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-line">
              <th className="font-medium pb-2">Description</th>
              <th className="font-medium pb-2 text-right">Qty</th>
              <th className="font-medium pb-2 text-right">Unit price</th>
              <th className="font-medium pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((li, i) => (
              <tr key={i} className="border-b border-line last:border-0">
                <td className="py-2.5">{li.description}</td>
                <td className="py-2.5 text-right">{li.quantity}</td>
                <td className="py-2.5 text-right"><Money value={li.unitPrice} /></td>
                <td className="py-2.5 text-right"><Money value={li.lineTotal} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-line mt-2 pt-4 space-y-1.5 text-sm ml-auto max-w-[220px]">
          <div className="flex justify-between text-muted"><span>Subtotal</span><Money value={invoice.subtotal} /></div>
          <div className="flex justify-between text-muted"><span>Tax</span><Money value={invoice.taxAmount} /></div>
          <div className="flex justify-between font-semibold text-base"><span>Total</span><Money value={invoice.totalAmount} size="lg" /></div>
          {Number(invoice.amountPaid) > 0 && (
            <>
              <div className="flex justify-between text-success-500"><span>Paid</span><Money value={invoice.amountPaid} /></div>
              <div className="flex justify-between font-semibold"><span>Outstanding</span><Money value={invoice.outstandingBalance} /></div>
            </>
          )}
        </div>
      </div>

      {isEligibleForAdvance && (
        <AdvancePanel invoiceId={invoice.id} outstanding={invoice.outstandingBalance} onRequested={() => navigate('/advances')} />
      )}
    </div>
  )
}

function AdvancePanel({ invoiceId, onRequested }) {
  const [quote, setQuote] = useState(null)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)

  async function handleGetQuote() {
    setError(null)
    setLoadingQuote(true)
    setOpen(true)
    try {
      const q = await advanceApi.quote(invoiceId)
      setQuote(q)
    } catch (err) {
      setError(err)
    } finally {
      setLoadingQuote(false)
    }
  }

  async function handleConfirm() {
    setError(null)
    setRequesting(true)
    try {
      await advanceApi.request(invoiceId)
      onRequested()
    } catch (err) {
      setError(err)
    } finally {
      setRequesting(false)
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-base font-semibold mb-1">Get paid early</h2>
      <p className="text-muted text-sm mb-4">
        Request a cash advance against this invoice through LipaHaraka's partner lender.
        A fee applies and is deducted upfront — you'll see the exact breakdown before confirming.
      </p>

      <ErrorBanner error={error} />

      {!open && (
        <button onClick={handleGetQuote} className="btn-secondary mt-2">Check advance eligibility</button>
      )}

      {open && loadingQuote && <Spinner label="Calculating your quote" />}

      {open && quote && !loadingQuote && (
        <div className="mt-2">
          <dl className="space-y-1.5 text-sm mb-4">
            <div className="flex justify-between"><dt className="text-muted">Advance amount</dt><dd><Money value={quote.requestedAmount} /></dd></div>
            <div className="flex justify-between"><dt className="text-muted">Fee ({(quote.feePercentage * 100).toFixed(0)}%)</dt><dd className="text-danger-500">-<Money value={quote.feeAmount} /></dd></div>
            <div className="flex justify-between font-semibold border-t border-line pt-1.5"><dt>You receive</dt><dd><Money value={quote.netPayout} size="lg" /></dd></div>
          </dl>
          <button onClick={handleConfirm} disabled={requesting} className="btn-primary w-full">
            {requesting ? 'Submitting…' : 'Confirm and request advance'}
          </button>
        </div>
      )}
    </div>
  )
}

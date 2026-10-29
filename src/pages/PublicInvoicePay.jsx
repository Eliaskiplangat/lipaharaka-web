import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { invoiceApi } from '../api/invoices'
import { paymentApi } from '../api/payments'
import Money from '../components/Money'
import Spinner from '../components/Spinner'
import ErrorBanner from '../components/ErrorBanner'

const STEPS = { LOADING: 'loading', READY: 'ready', PROMPT_SENT: 'prompt_sent', PAID: 'paid', NOT_FOUND: 'not_found' }

/**
 * Buyer-facing, unauthenticated page reached via the invoice's shareable link
 * (see InvoiceDetail's "Payment link" — /pay/:token). No login, no sidebar: a buyer who has
 * never used LipaHaraka should be able to pay in one screen without any explanation.
 */
export default function PublicInvoicePay() {
  const { token } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [step, setStep] = useState(STEPS.LOADING)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const pollRef = useRef(null)

  const loadInvoice = useCallback(() => {
    invoiceApi
      .getPublic(token)
      .then((inv) => {
        setInvoice(inv)
        setStep(inv.status === 'PAID' ? STEPS.PAID : STEPS.READY)
      })
      .catch(() => setStep(STEPS.NOT_FOUND))
  }, [token])

  useEffect(() => {
    loadInvoice()
  }, [loadInvoice])

  // After the STK prompt is sent, poll the public invoice endpoint so the page updates itself
  // once the buyer completes payment on their phone — no manual refresh needed.
  useEffect(() => {
    if (step !== STEPS.PROMPT_SENT) return
    pollRef.current = setInterval(() => {
      invoiceApi.getPublic(token).then((inv) => {
        setInvoice(inv)
        if (inv.status === 'PAID') {
          setStep(STEPS.PAID)
          clearInterval(pollRef.current)
        }
      })
    }, 4000)
    return () => clearInterval(pollRef.current)
  }, [step, token])

  async function handlePay(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await paymentApi.initiate(token, phoneNumber)
      setStep(STEPS.PROMPT_SENT)
    } catch (err) {
      setError(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (step === STEPS.LOADING) {
    return (
      <PageShell>
        <Spinner label="Loading invoice" />
      </PageShell>
    )
  }

  if (step === STEPS.NOT_FOUND) {
    return (
      <PageShell>
        <div className="text-center py-6">
          <p className="font-medium mb-1">This invoice link isn't valid</p>
          <p className="text-muted text-sm">It may have expired, or the link may have been mistyped. Contact the business that sent it to you.</p>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="text-center mb-6">
        <p className="text-muted text-sm mb-1">Invoice {invoice.invoiceNumber}</p>
        <Money value={invoice.outstandingBalance} size="xl" />
        <p className="text-muted text-sm mt-1">due {invoice.dueDate}</p>
      </div>

      {step === STEPS.PAID ? (
        <div className="border border-success-500 bg-success-100 text-success-500 rounded px-4 py-4 text-center text-sm">
          <p className="font-medium">Payment received</p>
          <p className="mt-0.5">Thank you — this invoice is fully paid.</p>
        </div>
      ) : step === STEPS.PROMPT_SENT ? (
        <div className="border border-gold-500 bg-gold-100 text-gold-600 rounded px-4 py-4 text-center text-sm">
          <p className="font-medium">Check your phone</p>
          <p className="mt-0.5">Enter your M-Pesa PIN on the prompt sent to {phoneNumber} to complete payment.</p>
        </div>
      ) : (
        <form onSubmit={handlePay} className="space-y-4">
          <ErrorBanner error={error} />
          <div>
            <label className="field-label" htmlFor="phoneNumber">M-Pesa phone number</label>
            <input
              id="phoneNumber"
              type="tel"
              required
              placeholder="+254712345678"
              className="field-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Sending prompt…' : 'Pay with M-Pesa'}
          </button>
        </form>
      )}
    </PageShell>
  )
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-ink-700 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <p className="text-center font-serif text-2xl text-white tracking-tight mb-6">LipaHaraka</p>
        <div className="card p-6 md:p-8">{children}</div>
      </div>
    </div>
  )
}

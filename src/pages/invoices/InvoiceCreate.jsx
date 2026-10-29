import React, { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { invoiceApi } from '../../api/invoices'
import Money from '../../components/Money'
import ErrorBanner from '../../components/ErrorBanner'
import { IconArrowLeft, IconPlus } from '../../components/icons'

function emptyLineItem() {
  return { description: '', quantity: '1', unitPrice: '', taxRate: '0.16' }
}

/** FR-2.1: create an invoice with one or more line items; tax and totals are computed
 *  server-side, but mirrored here live so the SME sees the total before submitting. */
export default function InvoiceCreate() {
  const navigate = useNavigate()
  const [buyerName, setBuyerName] = useState('')
  const [buyerPhoneNumber, setBuyerPhoneNumber] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [lineItems, setLineItems] = useState([emptyLineItem()])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const totals = useMemo(() => {
    let subtotal = 0
    let tax = 0
    for (const item of lineItems) {
      const qty = parseFloat(item.quantity) || 0
      const price = parseFloat(item.unitPrice) || 0
      const rate = parseFloat(item.taxRate) || 0
      const lineSubtotal = qty * price
      subtotal += lineSubtotal
      tax += lineSubtotal * rate
    }
    return { subtotal, tax, total: subtotal + tax }
  }, [lineItems])

  function updateLineItem(index, field, value) {
    setLineItems((items) => items.map((it, i) => (i === index ? { ...it, [field]: value } : it)))
  }

  function addLineItem() {
    setLineItems((items) => [...items, emptyLineItem()])
  }

  function removeLineItem(index) {
    setLineItems((items) => items.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const payload = {
        buyerName,
        buyerPhoneNumber: buyerPhoneNumber || null,
        buyerEmail: buyerEmail || null,
        dueDate,
        lineItems: lineItems.map((it) => ({
          description: it.description,
          quantity: parseFloat(it.quantity),
          unitPrice: parseFloat(it.unitPrice),
          taxRate: parseFloat(it.taxRate) || 0,
        })),
      }
      const invoice = await invoiceApi.create(payload)
      navigate(`/invoices/${invoice.id}`)
    } catch (err) {
      setError(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Link to="/invoices" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal mb-4">
        <IconArrowLeft width={16} height={16} /> Back to invoices
      </Link>
      <h1 className="text-2xl mb-6">New invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ErrorBanner error={error} />

        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">Buyer</h2>
          <div>
            <label className="field-label" htmlFor="buyerName">Buyer name</label>
            <input id="buyerName" required className="field-input" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label" htmlFor="buyerPhoneNumber">Phone number</label>
              <input id="buyerPhoneNumber" type="tel" placeholder="+254712345678" className="field-input" value={buyerPhoneNumber} onChange={(e) => setBuyerPhoneNumber(e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="buyerEmail">Email</label>
              <input id="buyerEmail" type="email" className="field-input" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="dueDate">Due date</label>
            <input id="dueDate" type="date" required min={new Date().toISOString().slice(0, 10)} className="field-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">Line items</h2>
            <button type="button" onClick={addLineItem} className="btn-ghost text-sm">
              <IconPlus width={15} height={15} /> Add item
            </button>
          </div>

          <div className="space-y-3">
            {lineItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-start pb-3 border-b border-line last:border-0 last:pb-0">
                <div className="col-span-12 sm:col-span-5">
                  <input
                    required
                    placeholder="Description"
                    className="field-input"
                    value={item.description}
                    onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Qty"
                    className="field-input"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Unit price"
                    className="field-input"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(index, 'unitPrice', e.target.value)}
                  />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <select
                    className="field-input"
                    value={item.taxRate}
                    onChange={(e) => updateLineItem(index, 'taxRate', e.target.value)}
                  >
                    <option value="0">No VAT</option>
                    <option value="0.16">16% VAT</option>
                  </select>
                </div>
                <div className="col-span-1 flex justify-end">
                  {lineItems.length > 1 && (
                    <button type="button" onClick={() => removeLineItem(index)} className="text-muted hover:text-danger-500 text-lg leading-none px-2 py-2" aria-label="Remove item">
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-line pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <Money value={totals.subtotal} />
            </div>
            <div className="flex justify-between text-muted">
              <span>Tax</span>
              <Money value={totals.tax} />
            </div>
            <div className="flex justify-between font-semibold text-base pt-1">
              <span>Total</span>
              <Money value={totals.total} size="lg" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Creating…' : 'Create invoice'}
        </button>
      </form>
    </div>
  )
}

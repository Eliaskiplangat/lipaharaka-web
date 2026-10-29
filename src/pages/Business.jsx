import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { businessApi } from '../api/business'
import Spinner from '../components/Spinner'
import ErrorBanner from '../components/ErrorBanner'

const DOCUMENT_TYPES = [
  { value: 'NATIONAL_ID', label: "Owner's National ID" },
  { value: 'CERTIFICATE_OF_REGISTRATION', label: 'Certificate of Registration' },
  { value: 'KRA_PIN_CERTIFICATE', label: 'KRA PIN Certificate' },
]

const KYC_STATUS_COPY = {
  PENDING: {
    tone: 'border-gold-500 bg-gold-100 text-gold-600',
    heading: 'Verification in progress',
    body: 'Your documents are under review. This usually takes 1–2 business days.',
  },
  APPROVED: {
    tone: 'border-success-500 bg-success-100 text-success-500',
    heading: 'Verified',
    body: 'Your business is verified. You can now send invoices and request advances.',
  },
  REJECTED: {
    tone: 'border-danger-500 bg-danger-100 text-danger-600',
    heading: 'Verification unsuccessful',
    body: null, // filled in from kycReviewReason
  },
}

export default function Business() {
  const navigate = useNavigate()
  const [business, setBusiness] = useState(undefined) // undefined = loading, null = none yet
  const [error, setError] = useState(null)

  useEffect(() => {
    businessApi
      .getMine()
      .then(setBusiness)
      .catch((err) => {
        if (err.status === 404) setBusiness(null)
        else setError(err)
      })
  }, [])

  if (business === undefined && !error) return <Spinner label="Loading business profile" />

  if (!business) {
    return <CreateBusinessForm onCreated={setBusiness} />
  }

  return <BusinessProfile business={business} onDocumentUploaded={setBusiness} />
}

function CreateBusinessForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', kraPin: '', sector: '', mpesaShortcode: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const created = await businessApi.create(form)
      onCreated(created)
    } catch (err) {
      setError(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl mb-1">Set up your business</h1>
      <p className="text-muted text-sm mb-6">
        This information is used to verify your business and route M-Pesa payments correctly.
      </p>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <ErrorBanner error={error} />
        <div>
          <label className="field-label" htmlFor="name">Business name</label>
          <input id="name" required className="field-input" value={form.name} onChange={update('name')} />
        </div>
        <div>
          <label className="field-label" htmlFor="kraPin">KRA PIN</label>
          <input id="kraPin" required className="field-input" value={form.kraPin} onChange={update('kraPin')} />
        </div>
        <div>
          <label className="field-label" htmlFor="sector">Sector</label>
          <input id="sector" placeholder="e.g. Retail, Construction, Logistics" className="field-input" value={form.sector} onChange={update('sector')} />
        </div>
        <div>
          <label className="field-label" htmlFor="mpesaShortcode">M-Pesa till or paybill number</label>
          <input id="mpesaShortcode" className="field-input" value={form.mpesaShortcode} onChange={update('mpesaShortcode')} />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Saving…' : 'Continue'}
        </button>
      </form>
    </div>
  )
}

function BusinessProfile({ business, onDocumentUploaded }) {
  const statusCopy = KYC_STATUS_COPY[business.kycStatus]
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl mb-1">Business & KYC</h1>
        <p className="text-muted text-sm">Manage your business profile and verification documents.</p>
      </div>

      <div className={`border rounded px-4 py-3 text-sm ${statusCopy.tone}`}>
        <p className="font-medium">{statusCopy.heading}</p>
        <p className="mt-0.5">{business.kycReviewReason || statusCopy.body}</p>
      </div>

      <div className="card p-6">
        <h2 className="text-base font-semibold mb-4">Business details</h2>
        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          <dt className="text-muted">Name</dt>
          <dd>{business.name}</dd>
          <dt className="text-muted">KRA PIN</dt>
          <dd>{business.kraPin}</dd>
          <dt className="text-muted">Sector</dt>
          <dd>{business.sector || '—'}</dd>
          <dt className="text-muted">M-Pesa shortcode</dt>
          <dd>{business.mpesaShortcode || '—'}</dd>
        </dl>
      </div>

      {business.kycStatus !== 'APPROVED' && (
        <KycDocumentUploadForm onUploaded={onDocumentUploaded} />
      )}
    </div>
  )
}

function KycDocumentUploadForm({ onUploaded }) {
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0].value)
  const [fileUrl, setFileUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const updated = await businessApi.uploadKycDocument({ documentType, fileUrl })
      onUploaded(updated)
      setFileUrl('')
      setSuccess(true)
    } catch (err) {
      setError(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-base font-semibold mb-1">Upload a document</h2>
      <p className="text-muted text-sm mb-4">
        Paste a link to a hosted copy of the document. (In production this would be a direct
        file upload backed by object storage.)
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorBanner error={error} />
        {success && (
          <div className="border border-line bg-ink-50 text-ink-700 rounded px-3 py-2 text-sm">
            Document uploaded.
          </div>
        )}
        <div>
          <label className="field-label" htmlFor="documentType">Document type</label>
          <select id="documentType" className="field-input" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
            {DOCUMENT_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="fileUrl">Document URL</label>
          <input id="fileUrl" type="url" required placeholder="https://…" className="field-input" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
        </div>
        <button type="submit" disabled={submitting} className="btn-secondary">
          {submitting ? 'Uploading…' : 'Upload document'}
        </button>
      </form>
    </div>
  )
}

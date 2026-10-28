import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import AuthLayout from './AuthLayout'
import ErrorBanner from '../components/ErrorBanner'

const STEPS = { PHONE: 'phone', DETAILS: 'details' }

/**
 * FR-1.1: phone-number registration verified via OTP. Two steps: request the code, then
 * submit it together with account details in one call (matching the backend's single
 * /auth/register endpoint, which verifies the OTP and creates the account atomically).
 */
export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(STEPS.PHONE)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState(null)
  const [requestingOtp, setRequestingOtp] = useState(false)
  const [otpSentNotice, setOtpSentNotice] = useState(false)

  async function handleRequestOtp(e) {
    e.preventDefault()
    setError(null)
    setRequestingOtp(true)
    try {
      await authApi.requestOtp(phoneNumber)
      setOtpSentNotice(true)
      setStep(STEPS.DETAILS)
    } catch (err) {
      setError(err)
    } finally {
      setRequestingOtp(false)
    }
  }

  async function handleCompleteRegistration(e) {
    e.preventDefault()
    setError(null)
    try {
      await register({ phoneNumber, fullName, password, otpCode })
      navigate('/business/setup', { replace: true })
    } catch (err) {
      setError(err)
    }
  }

  if (step === STEPS.PHONE) {
    return (
      <AuthLayout title="Create an account" subtitle="We'll text you a verification code to confirm this number.">
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <ErrorBanner error={error} />
          <div>
            <label className="field-label" htmlFor="phoneNumber">Phone number</label>
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
          <button type="submit" disabled={requestingOtp} className="btn-primary w-full">
            {requestingOtp ? 'Sending code…' : 'Send verification code'}
          </button>
        </form>
        <p className="text-sm text-muted text-center mt-6">
          Already have an account? <Link to="/login" className="text-ink-700 font-medium hover:underline">Log in</Link>
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Verify and set up your account" subtitle={`Enter the code sent to ${phoneNumber}.`}>
      <form onSubmit={handleCompleteRegistration} className="space-y-4">
        <ErrorBanner error={error} />
        {otpSentNotice && (
          <div className="border border-line bg-ink-50 text-ink-700 rounded px-3 py-2 text-sm">
            Verification code sent. It expires in a few minutes.
          </div>
        )}
        <div>
          <label className="field-label" htmlFor="otpCode">Verification code</label>
          <input
            id="otpCode"
            inputMode="numeric"
            required
            maxLength={6}
            placeholder="123456"
            className="field-input tracking-[0.3em] text-center"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            required
            className="field-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-muted mt-1">At least 8 characters.</p>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
        <button type="button" onClick={() => setStep(STEPS.PHONE)} className="btn-ghost w-full">
          Use a different number
        </button>
      </form>
    </AuthLayout>
  )
}

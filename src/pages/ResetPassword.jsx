import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../api/auth'
import AuthLayout from './AuthLayout'
import ErrorBanner from '../components/ErrorBanner'

const STEPS = { PHONE: 'phone', RESET: 'reset' }

export default function ResetPassword() {
  const [step, setStep] = useState(STEPS.PHONE)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [otpSentNotice, setOtpSentNotice] = useState(false)

  async function handleRequestOtp(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authApi.requestPasswordResetOtp(phoneNumber)
      setOtpSentNotice(true)
      setStep(STEPS.RESET)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authApi.resetPassword({ phoneNumber, otpCode, newPassword })
      setStep(STEPS.PHONE)
      setPhoneNumber('')
      setOtpCode('')
      setNewPassword('')
      setOtpSentNotice(false)
      alert('Password reset successful. Please log in with your new password.')
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  if (step === STEPS.PHONE) {
    return (
      <AuthLayout title="Reset password" subtitle="We’ll send a code to your registered phone number.">
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
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending code…' : 'Send reset code'}
          </button>
        </form>
        <p className="text-sm text-muted text-center mt-6">
          Remembered your password? <Link to="/login" className="text-ink-700 font-medium hover:underline">Log in</Link>
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create new password" subtitle={`Enter the code sent to ${phoneNumber}.`}>
      <form onSubmit={handleResetPassword} className="space-y-4">
        <ErrorBanner error={error} />
        {otpSentNotice && (
          <div className="border border-line bg-ink-50 text-ink-700 rounded px-3 py-2 text-sm">
            A reset code has been sent. It expires in a few minutes.
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
          <label className="field-label" htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={8}
            className="field-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Updating password…' : 'Update password'}
        </button>
        <button type="button" onClick={() => setStep(STEPS.PHONE)} className="btn-ghost w-full">
          Use a different number
        </button>
      </form>
    </AuthLayout>
  )
}

import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from './AuthLayout'
import ErrorBanner from '../components/ErrorBanner'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await login(phoneNumber, password)
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (err) {
      setError(err)
    }
  }

  return (
    <AuthLayout title="Log in" subtitle="Enter the phone number your business is registered with.">
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="text-sm text-muted text-center mt-6">
        New to LipaHaraka? <Link to="/register" className="text-ink-700 font-medium hover:underline">Create an account</Link>
      </p>
    </AuthLayout>
  )
}

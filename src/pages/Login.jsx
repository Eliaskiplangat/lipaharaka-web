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
    <AuthLayout title="" subtitle="Enter your username and Password to sign in">
      <form onSubmit={handleSubmit} className="space-y-5">
        <ErrorBanner error={error} />

        <div>
          <input
            id="phoneNumber"
            type="tel"
            required
            placeholder="Email address / ID"
            className="auth-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="relative">
          <input
            id="password"
            type="password"
            required
            placeholder="Enter your Password"
            className="auth-input pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Link to="/register" className="text-sm text-emerald-100/80 hover:text-white">Forgot password?</Link>
        </div>

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Logging in…' : 'Login Now'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-emerald-50/80">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-white hover:text-emerald-100">Register Now</Link>
      </p>
    </AuthLayout>
  )
}

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { businessApi } from '../api/business'
import { adminApi } from '../api/admin'
import { useAuth } from '../context/AuthContext'
import ErrorBanner from '../components/ErrorBanner'
import Spinner from '../components/Spinner'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [business, setBusiness] = useState(null)
  const [adminBusinesses, setAdminBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [savingMessage, setSavingMessage] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [profileData, businessData] = await Promise.all([
          authApi.getCurrentUser?.() ?? Promise.resolve({ fullName: user?.fullName || '' }),
          businessApi.getMine().catch(() => null),
        ])

        setProfile({ fullName: profileData.fullName || '', phoneNumber: profileData.phoneNumber || '' })
        setBusiness(businessData)

        if (user?.role === 'ADMIN') {
          const adminData = await adminApi.listBusinesses({ page: 0, size: 20 })
          setAdminBusinesses(adminData?.content || [])
        }
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user])

  async function updateProfile(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSavingMessage('')
    try {
      const updated = await authApi.updateProfile({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
      })

      setProfile({ fullName: updated.fullName, phoneNumber: updated.phoneNumber })
      setSavingMessage('Profile updated successfully.')
    } catch (err) {
      setError(err)
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteAccount() {
    if (!window.confirm('Delete this account permanently? This action cannot be undone.')) return
    setError(null)
    try {
      await authApi.deleteAccount()
      logout()
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err)
    }
  }

  async function deleteBusiness(businessId) {
    if (!window.confirm('Remove this business from the platform?')) return
    try {
      await adminApi.removeBusiness(businessId)
      setAdminBusinesses((items) => items.filter((item) => item.id !== businessId))
    } catch (err) {
      setError(err)
    }
  }

  if (loading) return <Spinner label="Loading settings" />

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl">Settings</h1>
        <p className="text-muted text-sm">Manage your account, profile details, and business visibility.</p>
      </div>

      <ErrorBanner error={error} />

      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        {profile ? (
          <form onSubmit={updateProfile} className="space-y-4">
            <div>
              <label className="field-label">Full name</label>
              <input
                className="field-input"
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
              />
            </div>
            <div>
              <label className="field-label">Phone number</label>
              <input
                className="field-input"
                value={profile.phoneNumber}
                onChange={(e) => setProfile((p) => ({ ...p, phoneNumber: e.target.value }))}
              />
            </div>
            {savingMessage && <div className="text-sm text-success-500">{savingMessage}</div>}
            <div className="flex items-center gap-3">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Saving…' : 'Save changes'}
              </button>
              <button type="button" onClick={deleteAccount} className="btn-secondary border-danger-500 text-danger-500">
                Delete account
              </button>
            </div>
          </form>
        ) : (
          <p className="text-muted">No profile available.</p>
        )}
      </div>

      {user?.role !== 'ADMIN' && business && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-2">Business status</h2>
          <p className="text-sm text-muted">Business name: {business.name}</p>
          <p className="text-sm text-muted">KYC status: {business.kycStatus}</p>
        </div>
      )}

      {user?.role === 'ADMIN' && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Business management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-2 pr-4">Business</th>
                  <th className="py-2 pr-4">KRA</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {adminBusinesses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-3 text-muted">No businesses found.</td>
                  </tr>
                ) : (
                  adminBusinesses.map((item) => (
                    <tr key={item.id} className="border-b border-line last:border-0">
                      <td className="py-3 pr-4">{item.name}</td>
                      <td className="py-3 pr-4">{item.kraPin}</td>
                      <td className="py-3 pr-4">{item.kycStatus}</td>
                      <td className="py-3 pr-4">
                        <button type="button" onClick={() => deleteBusiness(item.id)} className="text-danger-500 font-medium">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** Gate for SME-owner routes. Pass requireRole="ADMIN" for admin-only pages. */
export default function ProtectedRoute({ children, requireRole }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/" replace />
  }
  return children
}

import { apiClient } from './client'

export const adminApi = {
  getKpis: () => apiClient.get('/api/v1/admin/kpis').then((r) => r.data),

  listPendingKyc: ({ page = 0, size = 20 } = {}) =>
    apiClient.get('/api/v1/admin/kyc/pending', { params: { page, size } }).then((r) => r.data),

  listBusinesses: ({ page = 0, size = 20 } = {}) =>
    apiClient.get('/api/v1/admin/businesses', { params: { page, size } }).then((r) => r.data),

  reviewKyc: (businessId, { approve, reason }) =>
    apiClient.post(`/api/v1/admin/kyc/${businessId}/review`, { approve, reason }).then((r) => r.data),

  removeBusiness: (businessId) =>
    apiClient.delete(`/api/v1/admin/businesses/${businessId}`).then((r) => r.data),

  getAuditLogs: (entityType, entityId, { page = 0, size = 20 } = {}) =>
    apiClient
      .get('/api/v1/admin/audit-logs', { params: { entityType, entityId, page, size } })
      .then((r) => r.data),
}

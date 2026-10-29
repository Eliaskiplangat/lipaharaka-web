import { apiClient } from './client'

export const invoiceApi = {
  create: (payload) => apiClient.post('/api/v1/invoices', payload).then((r) => r.data),

  send: (id) => apiClient.post(`/api/v1/invoices/${id}/send`).then((r) => r.data),

  list: ({ page = 0, size = 20 } = {}) =>
    apiClient.get('/api/v1/invoices', { params: { page, size, sort: 'createdAt,desc' } }).then((r) => r.data),

  get: (id) => apiClient.get(`/api/v1/invoices/${id}`).then((r) => r.data),

  // Public, unauthenticated — used by the buyer-facing pay page.
  getPublic: (token) => apiClient.get(`/api/v1/invoices/public/${token}`).then((r) => r.data),
}

import { apiClient } from './client'

export const advanceApi = {
  quote: (invoiceId) =>
    apiClient.get('/api/v1/advances/quote', { params: { invoiceId } }).then((r) => r.data),

  request: (invoiceId) => apiClient.post('/api/v1/advances', { invoiceId }).then((r) => r.data),

  list: ({ page = 0, size = 20 } = {}) =>
    apiClient.get('/api/v1/advances', { params: { page, size } }).then((r) => r.data),
}

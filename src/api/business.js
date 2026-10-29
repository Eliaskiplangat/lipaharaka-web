import { apiClient } from './client'

export const businessApi = {
  create: ({ name, kraPin, sector, mpesaShortcode }) =>
    apiClient.post('/api/v1/businesses', { name, kraPin, sector, mpesaShortcode }).then((r) => r.data),

  getMine: () => apiClient.get('/api/v1/businesses/me').then((r) => r.data),

  uploadKycDocument: ({ documentType, fileUrl }) =>
    apiClient.post('/api/v1/businesses/me/kyc-documents', { documentType, fileUrl }).then((r) => r.data),
}

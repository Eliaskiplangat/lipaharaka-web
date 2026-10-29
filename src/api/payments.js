import { apiClient } from './client'

export const paymentApi = {
  // Public, unauthenticated — buyer taps "Pay" on the shared invoice link.
  initiate: (token, payerPhoneNumber) =>
    apiClient
      .post(`/api/v1/payments/mpesa/invoices/${token}/initiate`, { payerPhoneNumber })
      .then((r) => r.data),
}

import { apiClient } from './client'

export const authApi = {
  requestOtp: (phoneNumber) =>
    apiClient.post('/api/v1/auth/otp/request', { phoneNumber }).then((r) => r.data),

  register: ({ phoneNumber, fullName, password, otpCode }) =>
    apiClient.post('/api/v1/auth/register', { phoneNumber, fullName, password, otpCode }).then((r) => r.data),

  login: ({ phoneNumber, password }) =>
    apiClient.post('/api/v1/auth/login', { phoneNumber, password }).then((r) => r.data),

  getCurrentUser: () =>
    apiClient.get('/api/v1/users/me').then((r) => r.data),

  updateProfile: ({ fullName, phoneNumber }) =>
    apiClient.put('/api/v1/users/me', { fullName, phoneNumber }).then((r) => r.data),

  deleteAccount: () =>
    apiClient.delete('/api/v1/users/me').then((r) => r.data),
}

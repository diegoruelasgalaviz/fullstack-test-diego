import { api } from './api'

export interface User {
  id: string
  name: string
  email: string
  organizationId: string | null
}

export interface AuthToken {
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export interface AuthResponse {
  user: User
  token: AuthToken
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),

  register: (credentials: RegisterCredentials) =>
    api.post<AuthResponse>('/auth/register', credentials),

  refreshToken: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }),

  revokeToken: (refreshToken: string) =>
    api.post('/auth/revoke', { refreshToken }),

  getToken: () => localStorage.getItem('token'),

  setToken: (token: string) => localStorage.setItem('token', token),

  getRefreshToken: () => localStorage.getItem('refreshToken'),

  setRefreshToken: (token: string) => localStorage.setItem('refreshToken', token),

  removeTokens: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
}

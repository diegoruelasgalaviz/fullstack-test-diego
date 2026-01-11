const API_BASE = '/api'

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (options.headers) {
    Object.assign(headers, options.headers)
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  // If unauthorized, try to refresh token automatically
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken && endpoint !== '/auth/refresh') {
      try {
        const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        })

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json()
          localStorage.setItem('token', refreshData.token.accessToken)
          localStorage.setItem('refreshToken', refreshData.token.refreshToken)
          localStorage.setItem('user', JSON.stringify(refreshData.user))

          // Retry the original request with new token
          const retryHeaders = { ...headers }
          retryHeaders['Authorization'] = `Bearer ${refreshData.token.accessToken}`

          const retryResponse = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: retryHeaders,
          })

          if (retryResponse.ok) {
            return retryResponse.json()
          }
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
        // Clear tokens and redirect to login on refresh failure
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        console.log('🔄 AUTO LOGOUT: Tokens cleared, redirecting to login...')
        // Force redirect
        window.location.replace('/login')
        // Throw error to stop execution
        throw new Error('Authentication failed - redirecting to login')
      }
    }

    // If refresh failed or no refresh token, throw original error
    const data = await response.json()
    throw new ApiError(response.status, data.error || 'Request failed')
  }

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'Request failed')
  }

  return data
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
}

export { ApiError }

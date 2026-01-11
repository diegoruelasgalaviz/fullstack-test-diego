import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authService, type User } from '../services'

interface AuthContextType {
  user: User | null
  token: string | null
  refreshToken: string | null
  login: (token: string, refreshToken: string, user: User) => void
  logout: () => void
  refreshTokens: () => Promise<boolean>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = authService.getToken()
    const storedRefreshToken = authService.getRefreshToken()
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedRefreshToken && storedUser) {
      setToken(storedToken)
      setRefreshToken(storedRefreshToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (newToken: string, newRefreshToken: string, newUser: User) => {
    authService.setToken(newToken)
    authService.setRefreshToken(newRefreshToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setRefreshToken(newRefreshToken)
    setUser(newUser)
  }

  const logout = () => {
    authService.removeTokens()
    localStorage.removeItem('user')
    setToken(null)
    setRefreshToken(null)
    setUser(null)
  }

  const refreshTokens = async (): Promise<boolean> => {
    if (!refreshToken) return false

    try {
      const response = await authService.refreshToken(refreshToken)
      login(response.token.accessToken, response.token.refreshToken, response.user)
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout() // Logout if refresh fails
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        login,
        logout,
        refreshTokens,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

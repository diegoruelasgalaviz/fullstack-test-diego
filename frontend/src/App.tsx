import { useState } from 'react'
import { LoginForm } from './components/LoginForm'

interface User {
  id: string
  name: string
  email: string
  organizationId: string
}

interface AuthState {
  token: string
  user: User
}

function App() {
  const [auth, setAuth] = useState<AuthState | null>(null)

  const handleLoginSuccess = (data: { token: string; user: User }) => {
    setAuth(data)
    localStorage.setItem('token', data.token)
  }

  const handleLogout = () => {
    setAuth(null)
    localStorage.removeItem('token')
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">CRM Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">{auth.user.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Welcome, {auth.user.name}</h2>
          <p className="text-slate-600">You are now logged in to your organization.</p>
        </div>
      </main>
    </div>
  )
}

export default App

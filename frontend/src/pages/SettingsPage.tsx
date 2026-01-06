import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { organizationService, type Organization } from '../services'

export function SettingsPage() {
  const { user } = useAuth()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadOrganization()
  }, [])

  async function loadOrganization() {
    try {
      const data = await organizationService.get()
      setOrganization(data)
      setName(data.name)
    } catch (error) {
      console.error('Failed to load organization:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const updated = await organizationService.update({ name })
      setOrganization(updated)
      setEditing(false)
    } catch (error) {
      console.error('Failed to update organization:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-slate-500">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and organization</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500">Name</label>
              <p className="text-slate-900">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500">Email</label>
              <p className="text-slate-900">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Organization</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setName(organization?.name || '')
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500">Name</label>
                <p className="text-slate-900">{organization?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500">Created</label>
                <p className="text-slate-900">
                  {organization?.createdAt
                    ? new Date(organization.createdAt).toLocaleDateString()
                    : '-'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

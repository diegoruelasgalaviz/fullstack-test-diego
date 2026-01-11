import { useEffect, useState } from 'react'
import { contactService, type Contact, type PaginationResult, type ContactQueryOptions } from '../services'
import { ApiError } from '../services/api'
import { useToast } from '../context/ToastContext'

export function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const { addToast } = useToast()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalContacts, setTotalContacts] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    loadContacts()
  }, [])

  async function loadContacts(page = currentPage) {
    try {
      const options: ContactQueryOptions = {
        pagination: {
          page,
          limit: pageSize
        }
      }

      const result = await contactService.getAll(options)

      // Handle both paginated and non-paginated responses
      if (result && typeof result === 'object' && 'data' in result) {
        // Paginated response
        const paginatedResult = result as PaginationResult<Contact>
        setContacts(paginatedResult.data)
        setTotalContacts(paginatedResult.total)
        setTotalPages(paginatedResult.totalPages)
        setCurrentPage(paginatedResult.page)
      } else {
        // Fallback to simple array (backward compatibility)
        setContacts(result as Contact[])
        setTotalContacts((result as Contact[]).length)
        setTotalPages(1)
        setCurrentPage(1)
      }
    } catch (error) {
      console.error('Failed to load contacts:', error)

      // Handle authentication errors
      if (error instanceof ApiError && error.status === 401) {
        console.log('🔄 Authentication failed, triggering logout...')
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.replace('/login')
        return
      }

      // Handle other API errors with toast
      if (error instanceof ApiError) {
        addToast({
          type: 'error',
          title: 'Failed to Load Contacts',
          message: error.message || 'An unexpected error occurred',
        })
      }

      // Log validation failures for monitoring
      console.log('📊 Validation error logged:', error)
    } finally {
      setLoading(false)
    }
  }

  function openCreateForm() {
    setFormData({ name: '', email: '', phone: '' })
    setEditingContact(null)
    setShowForm(true)
  }

  function openEditForm(contact: Contact) {
    setFormData({
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
    })
    setEditingContact(contact)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setValidationErrors({}) // Clear previous validation errors

    try {
      if (editingContact) {
        await contactService.update(editingContact.id, formData)
      } else {
        await contactService.create(formData)
      }
      await loadContacts()
      setShowForm(false)
      setFormData({ name: '', email: '', phone: '' }) // Reset form

      addToast({
        type: 'success',
        title: editingContact ? 'Contact Updated' : 'Contact Created',
        message: 'Contact saved successfully',
      })
    } catch (error) {
      console.error('Failed to save contact:', error)

      // Handle validation errors (400)
      if (error instanceof ApiError && error.status === 400 && error.details) {
        setValidationErrors(error.details)
        addToast({
          type: 'warning',
          title: 'Validation Error',
          message: 'Please check the form for errors',
        })
        // Log validation failures for monitoring
        console.log('📊 Validation error logged:', error.details)
      }
      // Handle authentication errors
      else if (error instanceof ApiError && error.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.replace('/login')
      }
      // Handle other API errors
      else if (error instanceof ApiError) {
        addToast({
          type: 'error',
          title: 'Save Failed',
          message: error.message || 'An unexpected error occurred',
        })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      await contactService.delete(id)
      await loadContacts()
    } catch (error) {
      console.error('Failed to delete contact:', error)
    }
  }

  if (loading) {
    return <div className="text-slate-500">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-500 mt-1">Manage your contacts</p>
        </div>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-700 transition-colors"
        >
          Add Contact
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {editingContact ? 'Edit Contact' : 'New Contact'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  // Clear validation error when user starts typing
                  if (validationErrors.name) {
                    setValidationErrors({ ...validationErrors, name: '' })
                  }
                }}
                required
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  validationErrors.name
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-indigo-500'
                }`}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: '' })
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  validationErrors.email
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-indigo-500'
                }`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value })
                  if (validationErrors.phone) {
                    setValidationErrors({ ...validationErrors, phone: '' })
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  validationErrors.phone
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-indigo-500'
                }`}
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {contacts.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            No contacts yet. Add your first contact!
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-900 font-medium">{contact.name}</td>
                  <td className="px-6 py-4 text-slate-600">{contact.email || '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{contact.phone || '-'}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditForm(contact)}
                      className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 hover:text-red-500 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
            <div className="flex items-center text-sm text-slate-700">
              <span>
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalContacts)} of {totalContacts} contacts
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newPage = currentPage - 1
                  setCurrentPage(newPage)
                  loadContacts(newPage)
                }}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum)
                      loadContacts(pageNum)
                    }}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() => {
                  const newPage = currentPage + 1
                  setCurrentPage(newPage)
                  loadContacts(newPage)
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

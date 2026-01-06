import { api } from './api'

export interface Contact {
  id: string
  organizationId: string
  name: string
  email: string | null
  phone: string | null
  createdAt: string
}

export interface CreateContactDTO {
  name: string
  email?: string
  phone?: string
}

export interface UpdateContactDTO {
  name?: string
  email?: string
  phone?: string
}

export const contactService = {
  getAll: () => api.get<Contact[]>('/contacts'),

  getById: (id: string) => api.get<Contact>(`/contacts/${id}`),

  create: (data: CreateContactDTO) => api.post<Contact>('/contacts', data),

  update: (id: string, data: UpdateContactDTO) =>
    api.put<Contact>(`/contacts/${id}`, data),

  delete: (id: string) => api.delete(`/contacts/${id}`),
}

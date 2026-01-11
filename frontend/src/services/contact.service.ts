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

export interface PaginationOptions {
  page: number
  limit: number
}

export interface PaginationResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ContactQueryOptions {
  pagination?: PaginationOptions
  sort?: string
  filter?: string
}

export const contactService = {
  getAll: (options?: ContactQueryOptions) => {
    const params = new URLSearchParams()

    if (options?.pagination) {
      params.append('page', options.pagination.page.toString())
      params.append('limit', options.pagination.limit.toString())
    }

    if (options?.sort) {
      params.append('sort', options.sort)
    }

    if (options?.filter) {
      params.append('filter', options.filter)
    }

    const queryString = params.toString()
    const endpoint = queryString ? `/contacts?${queryString}` : '/contacts'

    return api.get<PaginationResult<Contact> | Contact[]>(endpoint)
  },

  getById: (id: string) => api.get<Contact>(`/contacts/${id}`),

  create: (data: CreateContactDTO) => api.post<Contact>('/contacts', data),

  update: (id: string, data: UpdateContactDTO) =>
    api.put<Contact>(`/contacts/${id}`, data),

  delete: (id: string) => api.delete(`/contacts/${id}`),
}

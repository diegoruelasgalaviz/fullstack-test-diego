import { api } from './api'

export type DealStatus = 'open' | 'won' | 'lost'

export interface Deal {
  id: string
  organizationId: string
  contactId: string | null
  stageId: string | null
  title: string
  value: number
  status: DealStatus
  createdAt: string
}

export interface CreateDealDTO {
  contactId?: string
  stageId?: string
  title: string
  value: number
}

export interface UpdateDealDTO {
  contactId?: string | null
  stageId?: string | null
  title?: string
  value?: number
  status?: DealStatus
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

export interface DealQueryOptions {
  pagination?: PaginationOptions
  sort?: string
  filter?: string
}

export const dealService = {
  getAll: (options?: DealQueryOptions) => {
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
    const endpoint = queryString ? `/deals?${queryString}` : '/deals'

    return api.get<PaginationResult<Deal> | Deal[]>(endpoint)
  },

  getById: (id: string) => api.get<Deal>(`/deals/${id}`),

  create: (data: CreateDealDTO) => api.post<Deal>('/deals', data),

  update: (id: string, data: UpdateDealDTO) =>
    api.put<Deal>(`/deals/${id}`, data),

  delete: (id: string) => api.delete(`/deals/${id}`),
}

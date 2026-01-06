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

export const dealService = {
  getAll: () => api.get<Deal[]>('/deals'),

  getById: (id: string) => api.get<Deal>(`/deals/${id}`),

  create: (data: CreateDealDTO) => api.post<Deal>('/deals', data),

  update: (id: string, data: UpdateDealDTO) =>
    api.put<Deal>(`/deals/${id}`, data),

  delete: (id: string) => api.delete(`/deals/${id}`),
}

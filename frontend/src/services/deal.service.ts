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

export interface DealStageHistory {
  id: string
  dealId: string
  stageId: string | null
  userId: string
  changedAt: string
  durationInStage: number | null
  notes: string | null
  createdAt: string
}

export interface DealStageHistoryWithDetails extends DealStageHistory {
  stageName: string | null
  stageColor: string | null
  userName: string
  userEmail: string
}

export interface DealAnalytics {
  dealId: string
  totalStages: number
  totalDuration: number
  currentStageDuration: number
  stageHistory: DealStageHistoryWithDetails[]
}

export interface StageDurationAnalytics {
  stageId: string
  stageName: string
  averageDuration: number
  totalTransitions: number
  minDuration: number
  maxDuration: number
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

  getDealHistory: (dealId: string) =>
    api.get<{ dealId: string; history: DealStageHistoryWithDetails[]; totalEntries: number }>(`/deals/${dealId}/history`),

  getDealAnalytics: (dealId: string) =>
    api.get<DealAnalytics>(`/deals/${dealId}/analytics`),

  getStageAnalytics: () =>
    api.get<{ organizationId: string; stageAnalytics: StageDurationAnalytics[]; totalStages: number }>('/analytics/stage-durations'),

  getOrganizationHistory: (limit?: number, offset?: number) => {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (offset) params.append('offset', offset.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `/analytics/organization-history?${queryString}` : '/analytics/organization-history'

    return api.get<{
      organizationId: string
      history: DealStageHistoryWithDetails[]
      total: number
      limit: number
      offset: number
    }>(endpoint)
  },
}

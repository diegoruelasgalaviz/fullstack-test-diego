import { api } from './api'

export interface Organization {
  id: string
  name: string
  createdAt: string
}

export const organizationService = {
  get: () => api.get<Organization>('/organizations'),

  update: (data: { name?: string }) =>
    api.put<Organization>('/organizations', data),
}

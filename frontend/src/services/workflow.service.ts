import { api } from './api'

export interface Stage {
  id: string
  workflowId: string
  name: string
  order: number
  color: string | null
}

export interface Workflow {
  id: string
  organizationId: string
  name: string
  stages: Stage[]
  createdAt: string
}

export interface CreateWorkflowDTO {
  name: string
  stages?: { name: string; order: number; color?: string }[]
}

export interface CreateStageDTO {
  name: string
  order: number
  color?: string
}

export const workflowService = {
  getAll: () => api.get<Workflow[]>('/workflows'),

  getById: (id: string) => api.get<Workflow>(`/workflows/${id}`),

  create: (data: CreateWorkflowDTO) => api.post<Workflow>('/workflows', data),

  update: (id: string, data: { name?: string }) =>
    api.put<Workflow>(`/workflows/${id}`, data),

  delete: (id: string) => api.delete(`/workflows/${id}`),

  addStage: (workflowId: string, data: CreateStageDTO) =>
    api.post<Stage>(`/workflows/${workflowId}/stages`, data),

  updateStage: (workflowId: string, stageId: string, data: Partial<CreateStageDTO>) =>
    api.put<Stage>(`/workflows/${workflowId}/stages/${stageId}`, data),

  deleteStage: (workflowId: string, stageId: string) =>
    api.delete(`/workflows/${workflowId}/stages/${stageId}`),
}

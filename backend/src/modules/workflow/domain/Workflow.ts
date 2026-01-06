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
  createdAt: Date
}

export interface CreateWorkflowDTO {
  organizationId: string
  name: string
  stages?: { name: string; order: number; color?: string }[]
}

export interface UpdateWorkflowDTO {
  name?: string
}

export interface CreateStageDTO {
  workflowId: string
  name: string
  order: number
  color?: string
}

export interface UpdateStageDTO {
  name?: string
  order?: number
  color?: string
}

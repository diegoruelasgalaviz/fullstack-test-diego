import type {
  Workflow,
  Stage,
  CreateWorkflowDTO,
  UpdateWorkflowDTO,
  CreateStageDTO,
  UpdateStageDTO,
} from './Workflow'

export interface WorkflowRepository {
  findAllByOrganization(organizationId: string): Promise<Workflow[]>
  findById(id: string): Promise<Workflow | null>
  create(data: CreateWorkflowDTO): Promise<Workflow>
  update(id: string, data: UpdateWorkflowDTO): Promise<Workflow | null>
  delete(id: string): Promise<boolean>
  addStage(data: CreateStageDTO): Promise<Stage>
  updateStage(id: string, data: UpdateStageDTO): Promise<Stage | null>
  deleteStage(id: string): Promise<boolean>
}

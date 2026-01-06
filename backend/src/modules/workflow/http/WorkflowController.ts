import type { Response } from 'express'
import type { AuthenticatedRequest } from '@shared/http'
import type { WorkflowUseCases } from '../application'

export class WorkflowController {
  constructor(private readonly workflowUseCases: WorkflowUseCases) {}

  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { organizationId } = req.user
    const workflows = await this.workflowUseCases.getAllByOrganization(organizationId)
    res.json(workflows)
  }

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params
    const workflow = await this.workflowUseCases.getWorkflowById(id)

    if (!workflow) {
      res.status(404).json({ error: 'Workflow not found' })
      return
    }

    if (workflow.organizationId !== req.user.organizationId) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    res.json(workflow)
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { organizationId } = req.user
    const { name, stages } = req.body

    if (!name) {
      res.status(400).json({ error: 'name is required' })
      return
    }

    const workflow = await this.workflowUseCases.createWorkflow({
      organizationId,
      name,
      stages,
    })
    res.status(201).json(workflow)
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params
    const { name } = req.body

    const existing = await this.workflowUseCases.getWorkflowById(id)
    if (!existing) {
      res.status(404).json({ error: 'Workflow not found' })
      return
    }

    if (existing.organizationId !== req.user.organizationId) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    const workflow = await this.workflowUseCases.updateWorkflow(id, { name })
    res.json(workflow)
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params

    const existing = await this.workflowUseCases.getWorkflowById(id)
    if (!existing) {
      res.status(404).json({ error: 'Workflow not found' })
      return
    }

    if (existing.organizationId !== req.user.organizationId) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    await this.workflowUseCases.deleteWorkflow(id)
    res.status(204).send()
  }

  async addStage(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params
    const { name, order, color } = req.body

    const workflow = await this.workflowUseCases.getWorkflowById(id)
    if (!workflow) {
      res.status(404).json({ error: 'Workflow not found' })
      return
    }

    if (workflow.organizationId !== req.user.organizationId) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    if (!name || order === undefined) {
      res.status(400).json({ error: 'name and order are required' })
      return
    }

    const stage = await this.workflowUseCases.addStage({
      workflowId: id,
      name,
      order,
      color,
    })
    res.status(201).json(stage)
  }

  async updateStage(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id, stageId } = req.params
    const { name, order, color } = req.body

    const workflow = await this.workflowUseCases.getWorkflowById(id)
    if (!workflow) {
      res.status(404).json({ error: 'Workflow not found' })
      return
    }

    if (workflow.organizationId !== req.user.organizationId) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    const stage = await this.workflowUseCases.updateStage(stageId, {
      name,
      order,
      color,
    })

    if (!stage) {
      res.status(404).json({ error: 'Stage not found' })
      return
    }

    res.json(stage)
  }

  async deleteStage(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id, stageId } = req.params

    const workflow = await this.workflowUseCases.getWorkflowById(id)
    if (!workflow) {
      res.status(404).json({ error: 'Workflow not found' })
      return
    }

    if (workflow.organizationId !== req.user.organizationId) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    const deleted = await this.workflowUseCases.deleteStage(stageId)

    if (!deleted) {
      res.status(404).json({ error: 'Stage not found' })
      return
    }

    res.status(204).send()
  }
}

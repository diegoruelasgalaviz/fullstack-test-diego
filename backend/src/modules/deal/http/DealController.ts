import type { Response } from 'express'
import type { AuthenticatedRequest } from '@shared/http'
import type { DealUseCases } from '../application'
import type { DealQueryOptions, PaginationResult } from '../domain'

export class DealController {
  constructor(private readonly dealUseCases: DealUseCases) {}

  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { organizationId } = req.user
    const queryOptions = this.parseQueryOptions(req)

    const result = await this.dealUseCases.getAllByOrganization(organizationId, queryOptions)

    // If result is paginated, return with metadata
    if (this.isPaginationResult(result)) {
      res.json(result)
    } else {
      // For backward compatibility, return simple array
      res.json(result)
    }
  }

  private parseQueryOptions(req: AuthenticatedRequest): DealQueryOptions | undefined {
    const { page, limit, sort, filter } = req.query
    const options: DealQueryOptions = {}

    // Parse pagination
    if (page && limit) {
      options.pagination = {
        page: parseInt(page as string, 10) || 1,
        limit: parseInt(limit as string, 10) || 10,
      }
    }

    // Parse sorting
    if (sort) {
      const sortParams = Array.isArray(sort) ? sort : [sort]
      options.sorts = {
        sorts: sortParams.map((s) => {
          const [field, order] = (s as string).split(':')
          return {
            field: field as any,
            order: (order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC') as any,
          }
        }),
      }
    }

    // Parse filtering (simplified version - can be extended)
    if (filter) {
      const filterStr = filter as string
      // Simple format: field:operator:value
      const [field, operator, value] = filterStr.split(':')
      if (field && operator && value) {
        options.filters = {
          conditions: [{
            field: field as any,
            operator: operator as any,
            value: this.parseFilterValue(value),
          }],
        }
      }
    }

    return Object.keys(options).length > 0 ? options : undefined
  }

  private parseFilterValue(value: string): any {
    // Try to parse as number, otherwise keep as string
    const numValue = parseFloat(value)
    return isNaN(numValue) ? value : numValue
  }

  private isPaginationResult(result: any): result is PaginationResult<any> {
    return result && typeof result === 'object' && 'data' in result && 'total' in result
  }

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params
    const deal = await this.dealUseCases.getDealById(id)

    if (!deal) {
      res.status(404).json({ error: 'Deal not found' })
      return
    }

    if (deal.organizationId !== req.user.organizationId) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    res.json(deal)
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { organizationId } = req.user
    const { contactId, stageId, title, value } = req.body

    if (!title || value === undefined) {
      res.status(400).json({ error: 'title and value are required' })
      return
    }

    const deal = await this.dealUseCases.createDeal({
      organizationId,
      contactId,
      stageId,
      title,
      value,
    }, req.user.userId)
    res.status(201).json(deal)
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params
    const { contactId, stageId, title, value, status } = req.body

    const existing = await this.dealUseCases.getDealById(id)
    if (!existing) {
      res.status(404).json({ error: 'Deal not found' })
      return
    }

    if (existing.organizationId !== req.user.organizationId) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    const deal = await this.dealUseCases.updateDeal(id, {
      contactId,
      stageId,
      title,
      value,
      status,
    }, req.user.userId)

    res.json(deal)
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params

    const existing = await this.dealUseCases.getDealById(id)
    if (!existing) {
      res.status(404).json({ error: 'Deal not found' })
      return
    }

    if (existing.organizationId !== req.user.organizationId) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    await this.dealUseCases.deleteDeal(id)
    res.status(204).send()
  }
}

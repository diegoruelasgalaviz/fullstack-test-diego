import type { Response } from 'express'
import type { AuthenticatedRequest } from '@shared/http'
import type { ContactUseCases } from '../application'
import type { ContactQueryOptions, PaginationResult } from '../domain'

export class ContactController {
  constructor(private readonly contactUseCases: ContactUseCases) {}

  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { organizationId } = req.user
    const queryOptions = this.parseQueryOptions(req)

    const result = await this.contactUseCases.getAllByOrganization(organizationId, queryOptions)

    // If result is paginated, return with metadata
    if (this.isPaginationResult(result)) {
      res.json(result)
    } else {
      // For backward compatibility, return simple array
      res.json(result)
    }
  }

  private parseQueryOptions(req: AuthenticatedRequest): ContactQueryOptions | undefined {
    const { page, limit, sort, filter } = req.query
    const options: ContactQueryOptions = {}

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
    const contact = await this.contactUseCases.getContactById(id)

    if (!contact) {
      res.status(404).json({ error: 'Contact not found' })
      return
    }

    // Ensure contact belongs to user's organization
    if (contact.organizationId !== req.user.organizationId) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    res.json(contact)
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { organizationId } = req.user
    const { name, email, phone } = req.body

    const contact = await this.contactUseCases.createContact({
      organizationId,
      name,
      email,
      phone,
    })
    res.status(201).json(contact)
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params
    const { name, email, phone } = req.body

    const existing = await this.contactUseCases.getContactById(id)
    if (!existing) {
      res.status(404).json({ error: 'Contact not found' })
      return
    }

    if (existing.organizationId !== req.user.organizationId) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    const contact = await this.contactUseCases.updateContact(id, {
      name,
      email,
      phone,
    })

    res.json(contact)
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params

    const existing = await this.contactUseCases.getContactById(id)
    if (!existing) {
      res.status(404).json({ error: 'Contact not found' })
      return
    }

    if (existing.organizationId !== req.user.organizationId) {
      res.status(403).json({ error: 'Access denied' })
      return
    }

    await this.contactUseCases.deleteContact(id)
    res.status(204).send()
  }
}

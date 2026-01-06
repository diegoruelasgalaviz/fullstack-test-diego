import type { Response } from 'express'
import type { AuthenticatedRequest } from '@shared/http'
import type { OrganizationUseCases } from '../application'

export class OrganizationController {
  constructor(private readonly organizationUseCases: OrganizationUseCases) {}

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { organizationId } = req.user
    const organization = await this.organizationUseCases.getOrganizationById(organizationId)

    if (!organization) {
      res.status(404).json({ error: 'Organization not found' })
      return
    }

    res.json(organization)
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { organizationId } = req.user
    const { name } = req.body

    const organization = await this.organizationUseCases.updateOrganization(organizationId, {
      name,
    })

    if (!organization) {
      res.status(404).json({ error: 'Organization not found' })
      return
    }

    res.json(organization)
  }
}

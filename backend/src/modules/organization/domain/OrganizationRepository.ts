import type { Organization, CreateOrganizationDTO, UpdateOrganizationDTO } from './Organization'

export interface OrganizationRepository {
  findById(id: string): Promise<Organization | null>
  create(data: CreateOrganizationDTO): Promise<Organization>
  update(id: string, data: UpdateOrganizationDTO): Promise<Organization | null>
}

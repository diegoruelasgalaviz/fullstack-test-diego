import type {
  Organization,
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
  OrganizationRepository,
} from '../domain'

export class OrganizationUseCases {
  constructor(private readonly organizationRepository: OrganizationRepository) {}

  async getOrganizationById(id: string): Promise<Organization | null> {
    return this.organizationRepository.findById(id)
  }

  async createOrganization(data: CreateOrganizationDTO): Promise<Organization> {
    return this.organizationRepository.create(data)
  }

  async updateOrganization(
    id: string,
    data: UpdateOrganizationDTO
  ): Promise<Organization | null> {
    return this.organizationRepository.update(id, data)
  }
}

import type { Repository } from 'typeorm'
import type {
  Organization,
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
  OrganizationRepository,
} from '../domain'
import { OrganizationEntity } from './OrganizationEntity'

export class PostgresOrganizationRepository implements OrganizationRepository {
  constructor(private readonly repository: Repository<OrganizationEntity>) {}

  async findById(id: string): Promise<Organization | null> {
    const entity = await this.repository.findOne({ where: { id } })
    return entity?.toDomain() ?? null
  }

  async create(data: CreateOrganizationDTO): Promise<Organization> {
    const entity = this.repository.create({ name: data.name })
    const saved = await this.repository.save(entity)
    return saved.toDomain()
  }

  async update(
    id: string,
    data: UpdateOrganizationDTO
  ): Promise<Organization | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null

    if (data.name !== undefined) entity.name = data.name
    const saved = await this.repository.save(entity)
    return saved.toDomain()
  }
}

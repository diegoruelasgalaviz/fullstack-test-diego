import type { Repository } from 'typeorm'
import type { Deal, CreateDealDTO, UpdateDealDTO, DealRepository } from '../domain'
import { DealEntity } from './DealEntity'

export class PostgresDealRepository implements DealRepository {
  constructor(private readonly repository: Repository<DealEntity>) {}

  async findAllByOrganization(organizationId: string): Promise<Deal[]> {
    const entities = await this.repository.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
    })
    return entities.map((e) => e.toDomain())
  }

  async findById(id: string): Promise<Deal | null> {
    const entity = await this.repository.findOne({ where: { id } })
    return entity?.toDomain() ?? null
  }

  async create(data: CreateDealDTO): Promise<Deal> {
    const entity = this.repository.create({
      organizationId: data.organizationId,
      contactId: data.contactId ?? null,
      stageId: data.stageId ?? null,
      title: data.title,
      value: data.value,
      status: 'open',
    })
    const saved = await this.repository.save(entity)
    return saved.toDomain()
  }

  async update(id: string, data: UpdateDealDTO): Promise<Deal | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null

    if (data.contactId !== undefined) entity.contactId = data.contactId
    if (data.stageId !== undefined) entity.stageId = data.stageId
    if (data.title !== undefined) entity.title = data.title
    if (data.value !== undefined) entity.value = data.value
    if (data.status !== undefined) entity.status = data.status

    const saved = await this.repository.save(entity)
    return saved.toDomain()
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id)
    return (result.affected ?? 0) > 0
  }
}

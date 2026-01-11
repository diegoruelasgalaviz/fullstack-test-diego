import type { Repository, SelectQueryBuilder } from 'typeorm'
import type { Deal, CreateDealDTO, UpdateDealDTO, DealRepository, DealQueryOptions, PaginationResult, FilterCondition, SortOption } from '../domain'
import { DealEntity } from './DealEntity'

export class PostgresDealRepository implements DealRepository {
  constructor(private readonly repository: Repository<DealEntity>) {}

  async findAllByOrganization(organizationId: string, options?: DealQueryOptions): Promise<PaginationResult<Deal> | Deal[]> {
    const queryBuilder = this.repository.createQueryBuilder('deal')
      .where('deal.organizationId = :organizationId', { organizationId })

    // Apply filters
    if (options?.filters?.conditions) {
      options.filters.conditions.forEach((condition, index) => {
        this.applyFilter(queryBuilder, condition, index)
      })
    }

    // Apply sorting
    if (options?.sorts?.sorts && options.sorts.sorts.length > 0) {
      options.sorts.sorts.forEach((sort) => {
        queryBuilder.addOrderBy(`deal.${sort.field}`, sort.order)
      })
    } else {
      // Default sorting by createdAt DESC
      queryBuilder.orderBy('deal.createdAt', 'DESC')
    }

    // If no pagination requested, return all results
    if (!options?.pagination) {
      const entities = await queryBuilder.getMany()
    return entities.map((e) => e.toDomain())
    }

    // Apply pagination
    const { page, limit } = options.pagination
    const offset = (page - 1) * limit

    queryBuilder.skip(offset).take(limit)

    // Get paginated results and total count
    const [entities, total] = await queryBuilder.getManyAndCount()

    const totalPages = Math.ceil(total / limit)

    return {
      data: entities.map((e) => e.toDomain()),
      total,
      page,
      limit,
      totalPages,
    }
  }

  private applyFilter(queryBuilder: SelectQueryBuilder<DealEntity>, condition: FilterCondition, index: number): void {
    const paramName = `param_${index}`
    const fieldName = `deal.${condition.field}`

    switch (condition.operator) {
      case 'equals':
        queryBuilder.andWhere(`${fieldName} = :${paramName}`, { [paramName]: condition.value })
        break
      case 'contains':
        queryBuilder.andWhere(`${fieldName} ILIKE :${paramName}`, { [paramName]: `%${condition.value}%` })
        break
      case 'startsWith':
        queryBuilder.andWhere(`${fieldName} ILIKE :${paramName}`, { [paramName]: `${condition.value}%` })
        break
      case 'greaterThan':
        queryBuilder.andWhere(`${fieldName} > :${paramName}`, { [paramName]: condition.value })
        break
      case 'lessThan':
        queryBuilder.andWhere(`${fieldName} < :${paramName}`, { [paramName]: condition.value })
        break
    }
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

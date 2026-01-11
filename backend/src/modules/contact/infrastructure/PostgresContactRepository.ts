import type { Repository, SelectQueryBuilder } from 'typeorm'
import type { Contact, CreateContactDTO, UpdateContactDTO, ContactRepository, ContactQueryOptions, PaginationResult, FilterCondition, SortOption } from '../domain'
import { ContactEntity } from './ContactEntity'

export class PostgresContactRepository implements ContactRepository {
  constructor(private readonly repository: Repository<ContactEntity>) {}

  async findAllByOrganization(organizationId: string, options?: ContactQueryOptions): Promise<PaginationResult<Contact> | Contact[]> {
    const queryBuilder = this.repository.createQueryBuilder('contact')
      .where('contact.organizationId = :organizationId', { organizationId })

    // Apply filters
    if (options?.filters?.conditions) {
      options.filters.conditions.forEach((condition, index) => {
        this.applyFilter(queryBuilder, condition, index)
      })
    }

    // Apply sorting
    if (options?.sorts?.sorts && options.sorts.sorts.length > 0) {
      options.sorts.sorts.forEach((sort) => {
        queryBuilder.addOrderBy(`contact.${sort.field}`, sort.order)
      })
    } else {
      // Default sorting by createdAt DESC
      queryBuilder.orderBy('contact.createdAt', 'DESC')
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

  private applyFilter(queryBuilder: SelectQueryBuilder<ContactEntity>, condition: FilterCondition, index: number): void {
    const paramName = `param_${index}`
    const fieldName = `contact.${condition.field}`

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

  async findById(id: string): Promise<Contact | null> {
    const entity = await this.repository.findOne({ where: { id } })
    return entity?.toDomain() ?? null
  }

  async create(data: CreateContactDTO): Promise<Contact> {
    const entity = this.repository.create({
      organizationId: data.organizationId,
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
    })
    const saved = await this.repository.save(entity)
    return saved.toDomain()
  }

  async update(id: string, data: UpdateContactDTO): Promise<Contact | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null

    if (data.name !== undefined) entity.name = data.name
    if (data.email !== undefined) entity.email = data.email
    if (data.phone !== undefined) entity.phone = data.phone

    const saved = await this.repository.save(entity)
    return saved.toDomain()
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id)
    return (result.affected ?? 0) > 0
  }
}

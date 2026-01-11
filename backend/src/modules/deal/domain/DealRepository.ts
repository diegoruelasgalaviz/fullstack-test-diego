import type { Deal, CreateDealDTO, UpdateDealDTO } from './Deal'

// Pagination types
export interface PaginationOptions {
  page: number
  limit: number
}

export interface PaginationResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Filtering types
export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'greaterThan' | 'lessThan'

export interface FilterCondition {
  field: keyof Deal
  operator: FilterOperator
  value: any
}

export interface FilterOptions {
  conditions: FilterCondition[]
}

// Sorting types
export type SortOrder = 'ASC' | 'DESC'

export interface SortOption {
  field: keyof Deal
  order: SortOrder
}

export interface SortOptions {
  sorts: SortOption[]
}

// Combined query options
export interface DealQueryOptions {
  pagination?: PaginationOptions
  filters?: FilterOptions
  sorts?: SortOptions
}

export interface DealRepository {
  findAllByOrganization(organizationId: string, options?: DealQueryOptions): Promise<PaginationResult<Deal> | Deal[]>
  findById(id: string): Promise<Deal | null>
  create(data: CreateDealDTO): Promise<Deal>
  update(id: string, data: UpdateDealDTO): Promise<Deal | null>
  delete(id: string): Promise<boolean>
}

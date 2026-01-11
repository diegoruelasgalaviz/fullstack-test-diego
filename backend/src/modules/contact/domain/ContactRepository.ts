import type { Contact, CreateContactDTO, UpdateContactDTO } from './Contact'

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
  field: keyof Contact
  operator: FilterOperator
  value: any
}

export interface FilterOptions {
  conditions: FilterCondition[]
}

// Sorting types
export type SortOrder = 'ASC' | 'DESC'

export interface SortOption {
  field: keyof Contact
  order: SortOrder
}

export interface SortOptions {
  sorts: SortOption[]
}

// Combined query options
export interface ContactQueryOptions {
  pagination?: PaginationOptions
  filters?: FilterOptions
  sorts?: SortOptions
}

export interface ContactRepository {
  findAllByOrganization(organizationId: string, options?: ContactQueryOptions): Promise<PaginationResult<Contact> | Contact[]>
  findById(id: string): Promise<Contact | null>
  create(data: CreateContactDTO): Promise<Contact>
  update(id: string, data: UpdateContactDTO): Promise<Contact | null>
  delete(id: string): Promise<boolean>
}

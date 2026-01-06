export interface Contact {
  id: string
  organizationId: string
  name: string
  email: string | null
  phone: string | null
  createdAt: Date
}

export interface CreateContactDTO {
  organizationId: string
  name: string
  email?: string
  phone?: string
}

export interface UpdateContactDTO {
  name?: string
  email?: string
  phone?: string
}

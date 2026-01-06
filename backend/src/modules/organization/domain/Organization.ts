export interface Organization {
  id: string
  name: string
  createdAt: Date
}

export interface CreateOrganizationDTO {
  name: string
}

export interface UpdateOrganizationDTO {
  name?: string
}

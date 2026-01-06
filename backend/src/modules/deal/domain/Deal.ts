export type DealStatus = 'open' | 'won' | 'lost'

export interface Deal {
  id: string
  organizationId: string
  contactId: string | null
  stageId: string | null
  title: string
  value: number
  status: DealStatus
  createdAt: Date
}

export interface CreateDealDTO {
  organizationId: string
  contactId?: string
  stageId?: string
  title: string
  value: number
}

export interface UpdateDealDTO {
  contactId?: string | null
  stageId?: string | null
  title?: string
  value?: number
  status?: DealStatus
}

// Deal validation schemas - no external dependencies
export const createDealSchema = {
  type: 'object',
  shape: {
    title: { type: 'string', min: 1, max: 200 },
    value: { type: 'number', positive: true, max: 999999999.99 },
    contactId: { type: 'string', uuid: true, optional: true },
    stageId: { type: 'string', uuid: true, optional: true }
  }
}

export const updateDealSchema = {
  type: 'object',
  shape: {
    title: { type: 'string', min: 1, max: 200, optional: true },
    value: { type: 'number', positive: true, max: 999999999.99, optional: true },
    contactId: { type: 'string', uuid: true, nullable: true, optional: true },
    stageId: { type: 'string', uuid: true, nullable: true, optional: true },
    status: { type: 'enum', values: ['open', 'won', 'lost'], optional: true }
  }
}

// Type definitions
export interface CreateDealInput {
  title: string
  value: number
  contactId?: string
  stageId?: string
}

export interface UpdateDealInput {
  title?: string
  value?: number
  contactId?: string | null
  stageId?: string | null
  status?: 'open' | 'won' | 'lost'
}
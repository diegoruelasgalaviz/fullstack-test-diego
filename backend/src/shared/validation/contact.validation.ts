// Contact validation schemas - no external dependencies
export const createContactSchema = {
  type: 'object',
  shape: {
    name: { type: 'string', min: 2, max: 100 },
    email: { type: 'string', email: true, optional: true, allowEmpty: true },
    phone: { type: 'string', min: 10, optional: true, allowEmpty: true }
  }
}

export const updateContactSchema = {
  type: 'object',
  shape: {
    name: { type: 'string', min: 2, max: 100, optional: true },
    email: { type: 'string', email: true, optional: true, allowEmpty: true },
    phone: { type: 'string', min: 10, optional: true, allowEmpty: true }
  }
}

// Type definitions
export interface CreateContactInput {
  name: string
  email?: string
  phone?: string
}

export interface UpdateContactInput {
  name?: string
  email?: string
  phone?: string
}
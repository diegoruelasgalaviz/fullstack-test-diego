// Basic validation schemas - no external dependencies
export const registerSchema = {
  type: 'object',
  shape: {
    name: { type: 'string', min: 2, max: 50 },
    email: { type: 'string', email: true },
    password: { type: 'string', min: 6, max: 100, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/ }
  }
}

export const loginSchema = {
  type: 'object',
  shape: {
    email: { type: 'string', email: true },
    password: { type: 'string', min: 1 }
  }
}

export const createOrganizationSchema = {
  type: 'object',
  shape: {
    name: { type: 'string', min: 2, max: 100 }
  }
}

// Type definitions
export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface CreateOrganizationInput {
  name: string
}
import { Request, Response, NextFunction } from 'express'

// Validation middleware - no external dependencies
export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string,
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Validation functions
function validateString(value: any, rules: any, fieldName: string) {
  // Handle empty strings for optional fields with allowEmpty
  if (rules.optional && rules.allowEmpty && value === '') {
    return undefined
  }
  if (rules.optional && (value === undefined || value === null || value === '')) {
    return value
  }
  if (!rules.optional && (value === undefined || value === null || value === '')) {
    throw new ValidationError(fieldName, 'This field is required')
  }
  if (typeof value !== 'string') {
    throw new ValidationError(fieldName, 'Must be a string')
  }
  if (rules.min && value.length < rules.min) {
    throw new ValidationError(fieldName, `Must be at least ${rules.min} characters long`)
  }
  if (rules.max && value.length > rules.max) {
    throw new ValidationError(fieldName, `Must be less than ${rules.max} characters`)
  }
  if (rules.email && !value.includes('@')) {
    throw new ValidationError(fieldName, 'Please enter a valid email address')
  }
  if (rules.pattern && !rules.pattern.test(value)) {
    throw new ValidationError(fieldName, 'Invalid format')
  }
  return value.trim()
}

function validateNumber(value: any, rules: any, fieldName: string) {
  if (rules.optional && (value === undefined || value === null)) {
    return value
  }
  if (!rules.optional && (value === undefined || value === null)) {
    throw new ValidationError(fieldName, 'This field is required')
  }
  const num = Number(value)
  if (isNaN(num)) {
    throw new ValidationError(fieldName, 'Must be a valid number')
  }
  if (rules.positive && num <= 0) {
    throw new ValidationError(fieldName, 'Must be greater than 0')
  }
  if (rules.max && num > rules.max) {
    throw new ValidationError(fieldName, `Cannot exceed ${rules.max}`)
  }
  return num
}

function validateUuid(value: any, rules: any, fieldName: string) {
  if (rules.optional && (value === undefined || value === null)) {
    return value
  }
  if (rules.nullable && value === null) {
    return value
  }
  if (!rules.optional && !rules.nullable && (value === undefined || value === null)) {
    throw new ValidationError(fieldName, 'This field is required')
  }
  // Basic UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(value)) {
    throw new ValidationError(fieldName, 'Must be a valid UUID')
  }
  return value
}

function validateEnum(value: any, rules: any, fieldName: string) {
  if (rules.optional && (value === undefined || value === null)) {
    return value
  }
  if (!rules.optional && (value === undefined || value === null)) {
    throw new ValidationError(fieldName, 'This field is required')
  }
  if (!rules.values.includes(value)) {
    throw new ValidationError(fieldName, `Must be one of: ${rules.values.join(', ')}`)
  }
  return value
}

function validateObject(data: any, schema: any) {
  if (typeof data !== 'object' || data === null) {
    throw new ValidationError('unknown', 'Must be an object')
  }
  const result: any = {}
  for (const [key, rules] of Object.entries(schema.shape)) {
    try {
      const value = data[key]
      switch (rules.type) {
        case 'string':
          result[key] = validateString(value, rules, key)
          break
        case 'number':
          result[key] = validateNumber(value, rules, key)
          break
        case 'uuid':
          result[key] = validateUuid(value, rules, key)
          break
        case 'enum':
          result[key] = validateEnum(value, rules, key)
          break
        default:
          result[key] = value
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error // Re-throw with correct field name
      }
      throw error
    }
  }
  return result
}

// Validation middleware
export function validateBody(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.type === 'object') {
        req.body = validateObject(req.body, schema)
      }
      next()
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: { [error.field]: error.message }
        })
        return
      }
      next(error)
    }
  }
}
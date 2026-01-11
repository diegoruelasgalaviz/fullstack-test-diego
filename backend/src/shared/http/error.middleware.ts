import { Request, Response, NextFunction } from 'express'
import { ValidationError } from '../validation/validation.middleware'

// Enhanced error response interface
interface ErrorResponse {
  error: string
  code: string
  details?: Record<string, string>
  timestamp: string
  path: string
  method: string
}

// Error handling middleware
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error for monitoring
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${error.name}: ${error.message}`)

  // Handle validation errors
  if (error instanceof ValidationError) {
    const response: ErrorResponse = {
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    }

    res.status(400).json(response)
    return
  }

  // Handle API errors (our custom ApiError class)
  if (error.name === 'ApiError') {
    const apiError = error as any
    const response: ErrorResponse = {
      error: apiError.message,
      code: apiError.status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'API_ERROR',
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    }

    res.status(apiError.status || 500).json(response)
    return
  }

  // Handle database errors
  if (error.name === 'QueryFailedError' || error.message.includes('duplicate key')) {
    const response: ErrorResponse = {
      error: 'A database error occurred. Please try again.',
      code: 'DATABASE_ERROR',
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    }

    res.status(500).json(response)
    return
  }

  // Handle authentication errors
  if (error.message.includes('Invalid credentials') ||
      error.message.includes('Invalid or expired token') ||
      error.message.includes('Refresh token has been revoked')) {
    const response: ErrorResponse = {
      error: error.message,
      code: 'AUTHENTICATION_ERROR',
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    }

    res.status(401).json(response)
    return
  }

  // Handle authorization errors
  if (error.message.includes('Unauthorized') ||
      error.message.includes('Forbidden')) {
    const response: ErrorResponse = {
      error: 'You do not have permission to perform this action.',
      code: 'AUTHORIZATION_ERROR',
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    }

    res.status(403).json(response)
    return
  }

  // Handle not found errors
  if (error.message.includes('not found') ||
      error.message.includes('does not exist')) {
    const response: ErrorResponse = {
      error: error.message,
      code: 'NOT_FOUND',
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    }

    res.status(404).json(response)
    return
  }

  // Default error handling
  const response: ErrorResponse = {
    error: process.env.NODE_ENV === 'development'
      ? error.message
      : 'An unexpected error occurred. Please try again later.',
    code: 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  }

  res.status(500).json(response)
}

// 404 handler for undefined routes
export function notFoundHandler(req: Request, res: Response): void {
  const response: ErrorResponse = {
    error: 'The requested resource was not found.',
    code: 'NOT_FOUND',
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  }

  res.status(404).json(response)
}
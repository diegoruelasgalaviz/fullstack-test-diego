import type { AuthToken } from './Auth'

export interface TokenPayload {
  userId: string
  organizationId: string
}

export interface TokenGenerator {
  generate(userId: string, organizationId: string): AuthToken
  verify(token: string): TokenPayload | null
}

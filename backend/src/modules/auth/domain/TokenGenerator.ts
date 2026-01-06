import type { AuthToken } from './Auth'

export interface TokenPayload {
  userId: string
}

export interface TokenGenerator {
  generate(userId: string): AuthToken
  verify(token: string): TokenPayload | null
}

import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import type { AuthToken, TokenGenerator, TokenPayload } from '../domain'

export class JwtTokenGenerator implements TokenGenerator {
  private readonly expiresInMs = 24 * 60 * 60 * 1000 // 24 hours

  constructor(private readonly secret: string) {}

  generate(userId: string, organizationId: string): AuthToken {
    const expiresAt = new Date(Date.now() + this.expiresInMs)

    const accessToken = jwt.sign(
      { userId, organizationId } satisfies TokenPayload,
      this.secret,
      { expiresIn: '24h' }
    )

    // Generate secure random refresh token (64 bytes = 128 hex characters)
    const refreshToken = randomBytes(64).toString('hex')

    return {
      accessToken,
      refreshToken,
      expiresAt,
    }
  }

  verify(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload
      return decoded
    } catch {
      return null
    }
  }
}

export interface RefreshToken {
  id: string
  userId: string
  token: string
  expiresAt: Date
  isRevoked: boolean
  device: string | null
  ipAddress: string | null
  createdAt: Date
}

export interface CreateRefreshTokenDTO {
  userId: string
  token: string
  expiresAt: Date
  device?: string | null
  ipAddress?: string | null
}

export interface RefreshTokenRepository {
  create(data: CreateRefreshTokenDTO): Promise<RefreshToken>
  findByToken(token: string): Promise<RefreshToken | null>
  findByUserId(userId: string): Promise<RefreshToken[]>
  revokeToken(token: string): Promise<void>
  revokeAllUserTokens(userId: string): Promise<void>
  deleteExpiredTokens(): Promise<void>
}

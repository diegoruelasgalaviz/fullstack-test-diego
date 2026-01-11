import type { Repository } from 'typeorm'
import type {
  RefreshToken,
  CreateRefreshTokenDTO,
  RefreshTokenRepository,
} from '../domain/RefreshTokenRepository'
import { RefreshTokenEntity } from './RefreshTokenEntity'

export class PostgresRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly repository: Repository<RefreshTokenEntity>) {}

  async create(data: CreateRefreshTokenDTO): Promise<RefreshToken> {
    const entity = this.repository.create({
      userId: data.userId,
      token: data.token,
      expiresAt: data.expiresAt,
      device: data.device ?? null,
      ipAddress: data.ipAddress ?? null,
      isRevoked: false,
    })
    const saved = await this.repository.save(entity)
    return this.toDomain(saved)
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const entity = await this.repository.findOne({
      where: { token },
      relations: ['user'],
    })
    if (!entity) return null
    return this.toDomain(entity)
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const entities = await this.repository.find({
      where: { userId, isRevoked: false },
      order: { createdAt: 'DESC' },
    })
    return entities.map((entity) => this.toDomain(entity))
  }

  async revokeToken(token: string): Promise<void> {
    await this.repository.update({ token }, { isRevoked: true })
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.repository.update({ userId, isRevoked: false }, { isRevoked: true })
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .execute()
  }

  private toDomain(entity: RefreshTokenEntity): RefreshToken {
    return {
      id: entity.id,
      userId: entity.userId,
      token: entity.token,
      expiresAt: entity.expiresAt,
      isRevoked: entity.isRevoked,
      device: entity.device,
      ipAddress: entity.ipAddress,
      createdAt: entity.createdAt,
    }
  }
}

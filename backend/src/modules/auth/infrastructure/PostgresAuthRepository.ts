import type { Repository } from 'typeorm'
import type { AuthUser, RegisterDTO, AuthRepository } from '../domain'
import { UserEntity } from '@modules/users/infrastructure'

export class PostgresAuthRepository implements AuthRepository {
  constructor(private readonly repository: Repository<UserEntity>) {}

  async findByEmail(email: string): Promise<AuthUser | null> {
    const entity = await this.repository.findOne({ where: { email } })
    if (!entity || !entity.password) {
      return null
    }
    return this.toAuthUser(entity)
  }

  async create(
    data: RegisterDTO & { hashedPassword: string; organizationId: string }
  ): Promise<AuthUser> {
    const entity = this.repository.create({
      name: data.name,
      email: data.email,
      password: data.hashedPassword,
      organizationId: data.organizationId,
    })
    const saved = await this.repository.save(entity)
    return this.toAuthUser(saved)
  }

  private toAuthUser(entity: UserEntity): AuthUser {
    return {
      id: entity.id,
      organizationId: entity.organizationId,
      name: entity.name,
      email: entity.email,
      password: entity.password!,
      createdAt: entity.createdAt,
    }
  }
}

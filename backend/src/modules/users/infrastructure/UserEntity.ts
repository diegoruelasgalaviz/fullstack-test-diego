import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import type { User } from '../domain'
import { OrganizationEntity } from '@modules/organization/infrastructure'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string | null

  @Column({ type: 'uuid', nullable: true, name: 'organization_id' })
  organizationId: string | null

  @ManyToOne(() => OrganizationEntity, { nullable: true })
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  toDomain(): User {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
    }
  }

  static fromDomain(user: Partial<User>): UserEntity {
    const entity = new UserEntity()
    if (user.id) entity.id = user.id
    if (user.name) entity.name = user.name
    if (user.email) entity.email = user.email
    if (user.createdAt) entity.createdAt = user.createdAt
    return entity
  }
}

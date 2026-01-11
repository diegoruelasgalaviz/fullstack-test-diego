import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import { UserEntity } from '@modules/users/infrastructure'

@Entity('refresh_tokens')
@Index(['token'], { unique: true })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @Column({ type: 'varchar', length: 500, unique: true })
  token: string

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt: Date

  @Column({ type: 'boolean', default: false, name: 'is_revoked' })
  isRevoked: boolean

  @Column({ type: 'varchar', length: 255, nullable: true })
  device: string | null

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'ip_address' })
  ipAddress: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

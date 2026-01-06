import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import type { Organization } from '../domain'

@Entity('organizations')
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  name: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  toDomain(): Organization {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
    }
  }
}

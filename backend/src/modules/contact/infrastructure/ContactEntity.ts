import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import type { Contact } from '../domain'
import { OrganizationEntity } from '@modules/organization/infrastructure'

@Entity('contacts')
export class ContactEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'organization_id' })
  organizationId: string

  @ManyToOne(() => OrganizationEntity)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  toDomain(): Contact {
    return {
      id: this.id,
      organizationId: this.organizationId,
      name: this.name,
      email: this.email,
      phone: this.phone,
      createdAt: this.createdAt,
    }
  }
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import type { Deal, DealStatus } from '../domain'
import { OrganizationEntity } from '@modules/organization/infrastructure'
import { ContactEntity } from '@modules/contact/infrastructure'
import { StageEntity } from '@modules/workflow/infrastructure'

@Entity('deals')
export class DealEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'organization_id' })
  organizationId: string

  @ManyToOne(() => OrganizationEntity)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity

  @Column({ type: 'uuid', nullable: true, name: 'contact_id' })
  contactId: string | null

  @ManyToOne(() => ContactEntity, { nullable: true })
  @JoinColumn({ name: 'contact_id' })
  contact: ContactEntity | null

  @Column({ type: 'uuid', nullable: true, name: 'stage_id' })
  stageId: string | null

  @ManyToOne(() => StageEntity, { nullable: true })
  @JoinColumn({ name: 'stage_id' })
  stage: StageEntity | null

  @Column({ type: 'varchar', length: 255 })
  title: string

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  value: number

  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: DealStatus

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  toDomain(): Deal {
    return {
      id: this.id,
      organizationId: this.organizationId,
      contactId: this.contactId,
      stageId: this.stageId,
      title: this.title,
      value: Number(this.value),
      status: this.status,
      createdAt: this.createdAt,
    }
  }
}

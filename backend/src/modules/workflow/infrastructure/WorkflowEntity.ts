import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import type { Workflow } from '../domain'
import { OrganizationEntity } from '@modules/organization/infrastructure'
import { StageEntity } from './StageEntity'

@Entity('workflows')
export class WorkflowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'organization_id' })
  organizationId: string

  @ManyToOne(() => OrganizationEntity)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity

  @Column({ type: 'varchar', length: 255 })
  name: string

  @OneToMany(() => StageEntity, (stage) => stage.workflow, { cascade: true, eager: true })
  stages: StageEntity[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  toDomain(): Workflow {
    return {
      id: this.id,
      organizationId: this.organizationId,
      name: this.name,
      stages: (this.stages ?? [])
        .sort((a, b) => a.order - b.order)
        .map((s) => s.toDomain()),
      createdAt: this.createdAt,
    }
  }
}

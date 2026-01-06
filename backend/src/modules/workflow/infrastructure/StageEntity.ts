import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import type { Stage } from '../domain'
import { WorkflowEntity } from './WorkflowEntity'

@Entity('stages')
export class StageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'workflow_id' })
  workflowId: string

  @ManyToOne(() => WorkflowEntity, (workflow) => workflow.stages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workflow_id' })
  workflow: WorkflowEntity

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'int' })
  order: number

  @Column({ type: 'varchar', length: 20, nullable: true })
  color: string | null

  toDomain(): Stage {
    return {
      id: this.id,
      workflowId: this.workflowId,
      name: this.name,
      order: this.order,
      color: this.color,
    }
  }
}

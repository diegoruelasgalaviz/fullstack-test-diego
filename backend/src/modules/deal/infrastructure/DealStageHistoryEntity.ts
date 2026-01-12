import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import type { DealStageHistory } from '../domain'
import { DealEntity } from './DealEntity'
import { StageEntity } from '@modules/workflow/infrastructure'
import { UserEntity } from '@modules/users/infrastructure'

@Entity('deal_stage_history')
@Index(['dealId', 'changedAt']) // Optimize queries by deal and time
@Index(['dealId']) // Optimize queries for deal history
export class DealStageHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'deal_id' })
  dealId: string

  @ManyToOne(() => DealEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deal_id' })
  deal: DealEntity

  @Column({ type: 'uuid', nullable: true, name: 'stage_id' })
  stageId: string | null

  @ManyToOne(() => StageEntity, { nullable: true })
  @JoinColumn({ name: 'stage_id' })
  stage: StageEntity | null

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @Column({ type: 'timestamp', name: 'changed_at' })
  changedAt: Date

  @Column({ type: 'bigint', nullable: true, name: 'duration_in_stage' })
  durationInStage: number | null // Duration in milliseconds

  @Column({ type: 'text', nullable: true })
  notes: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  toDomain(): DealStageHistory {
    return {
      id: this.id,
      dealId: this.dealId,
      stageId: this.stageId,
      userId: this.userId,
      changedAt: this.changedAt,
      durationInStage: this.durationInStage,
      notes: this.notes,
      createdAt: this.createdAt,
    }
  }

  static fromDomain(history: Partial<DealStageHistory>): DealStageHistoryEntity {
    const entity = new DealStageHistoryEntity()
    if (history.id) entity.id = history.id
    if (history.dealId) entity.dealId = history.dealId
    if (history.stageId !== undefined) entity.stageId = history.stageId
    if (history.userId) entity.userId = history.userId
    if (history.changedAt) entity.changedAt = history.changedAt
    if (history.durationInStage !== undefined) entity.durationInStage = history.durationInStage
    if (history.notes !== undefined) entity.notes = history.notes
    if (history.createdAt) entity.createdAt = history.createdAt
    return entity
  }
}
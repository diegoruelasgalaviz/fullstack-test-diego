import { Repository } from 'typeorm'
import type {
  DealStageHistoryRepository,
  DealStageHistory,
  CreateDealStageHistoryDTO,
  DealStageHistoryWithDetails,
  StageDurationAnalytics,
} from '../domain/DealStageHistoryRepository'
import { DealStageHistoryEntity } from './DealStageHistoryEntity'

export class PostgresDealStageHistoryRepository implements DealStageHistoryRepository {
  constructor(private readonly repository: Repository<DealStageHistoryEntity>) {}

  async create(data: CreateDealStageHistoryDTO): Promise<DealStageHistory> {
    const entity = DealStageHistoryEntity.fromDomain(data)
    if (!entity.changedAt) {
      entity.changedAt = new Date()
    }
    const saved = await this.repository.save(entity)
    return saved.toDomain()
  }

  async findByDealId(dealId: string): Promise<DealStageHistoryWithDetails[]> {
    const entities = await this.repository.find({
      where: { dealId },
      relations: ['stage', 'user', 'deal'],
      order: { changedAt: 'ASC' },
    })

    return entities.map(entity => ({
      ...entity.toDomain(),
      stageName: entity.stage?.name || null,
      stageColor: entity.stage?.color || null,
      userName: entity.user.name,
      userEmail: entity.user.email,
    }))
  }

  async findByDealIdWithDetails(dealId: string): Promise<DealStageHistoryWithDetails[]> {
    return this.findByDealId(dealId) // Alias for consistency
  }

  async findByOrganizationId(organizationId: string): Promise<DealStageHistoryWithDetails[]> {
    const entities = await this.repository
      .createQueryBuilder('history')
      .leftJoinAndSelect('history.stage', 'stage')
      .leftJoinAndSelect('history.user', 'user')
      .leftJoinAndSelect('history.deal', 'deal')
      .leftJoin('deal.organization', 'organization')
      .where('organization.id = :organizationId', { organizationId })
      .orderBy('history.changedAt', 'ASC')
      .getMany()

    return entities.map(entity => ({
      ...entity.toDomain(),
      stageName: entity.stage?.name || null,
      stageColor: entity.stage?.color || null,
      userName: entity.user.name,
      userEmail: entity.user.email,
    }))
  }

  async getStageAnalytics(organizationId: string): Promise<StageDurationAnalytics[]> {
    const result = await this.repository
      .createQueryBuilder('history')
      .select([
        'history.stageId as stageId',
        'stage.name as stageName',
        'COUNT(history.id) as totalTransitions',
        'AVG(history.durationInStage) as averageDuration',
        'MIN(history.durationInStage) as minDuration',
        'MAX(history.durationInStage) as maxDuration',
      ])
      .leftJoin('history.stage', 'stage')
      .leftJoin('history.deal', 'deal')
      .leftJoin('deal.organization', 'organization')
      .where('organization.id = :organizationId', { organizationId })
      .andWhere('history.durationInStage IS NOT NULL')
      .groupBy('history.stageId')
      .addGroupBy('stage.name')
      .orderBy('stage.name', 'ASC')
      .getRawMany()

    return result.map(row => ({
      stageId: row.stageId,
      stageName: row.stageName || 'Unknown Stage',
      averageDuration: parseInt(row.averageDuration) || 0,
      totalTransitions: parseInt(row.totalTransitions) || 0,
      minDuration: parseInt(row.minDuration) || 0,
      maxDuration: parseInt(row.maxDuration) || 0,
    }))
  }

  async getDealAnalytics(dealId: string): Promise<DealStageHistoryWithDetails[]> {
    return this.findByDealId(dealId)
  }

  async getCurrentStageDuration(dealId: string): Promise<number | null> {
    const latestEntry = await this.repository.findOne({
      where: { dealId },
      order: { changedAt: 'DESC' },
    })

    if (!latestEntry) {
      return null
    }

    const now = new Date()
    const duration = now.getTime() - latestEntry.changedAt.getTime()
    return duration
  }

  async deleteByDealId(dealId: string): Promise<void> {
    await this.repository.delete({ dealId })
  }
}
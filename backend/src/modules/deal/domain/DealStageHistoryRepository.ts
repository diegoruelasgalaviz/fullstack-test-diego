import type {
  DealStageHistory,
  CreateDealStageHistoryDTO,
  DealStageHistoryWithDetails,
  StageDurationAnalytics,
} from './DealStageHistory'

export interface DealStageHistoryRepository {
  create(data: CreateDealStageHistoryDTO): Promise<DealStageHistory>
  findByDealId(dealId: string): Promise<DealStageHistoryWithDetails[]>
  findByDealIdWithDetails(dealId: string): Promise<DealStageHistoryWithDetails[]>
  findByOrganizationId(organizationId: string): Promise<DealStageHistoryWithDetails[]>
  getStageAnalytics(organizationId: string): Promise<StageDurationAnalytics[]>
  getDealAnalytics(dealId: string): Promise<DealStageHistoryWithDetails[]>
  getCurrentStageDuration(dealId: string): Promise<number | null>
  deleteByDealId(dealId: string): Promise<void>
}
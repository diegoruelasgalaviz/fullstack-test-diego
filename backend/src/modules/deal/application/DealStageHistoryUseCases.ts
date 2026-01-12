import type {
  DealStageHistoryRepository,
  DealStageHistory,
  CreateDealStageHistoryDTO,
  DealStageHistoryWithDetails,
  StageDurationAnalytics,
  DealStageAnalytics,
} from '../domain/DealStageHistoryRepository'
import type { DealRepository } from '../domain/DealRepository'

export class DealStageHistoryUseCases {
  constructor(
    private readonly historyRepository: DealStageHistoryRepository,
    private readonly dealRepository: DealRepository,
  ) {}

  async recordStageChange(
    dealId: string,
    newStageId: string | null,
    userId: string,
    notes?: string,
  ): Promise<DealStageHistory> {
    console.log('🔄 Recording stage change:', { dealId, newStageId, userId, notes })

    try {
      // Get the previous stage change to calculate duration
      const history = await this.historyRepository.findByDealId(dealId)
      console.log('📚 Found history entries:', history.length)

      const lastEntry = history[history.length - 1]
      let durationInStage: number | null = null
      if (lastEntry) {
        // Calculate duration since last stage change
        durationInStage = new Date().getTime() - lastEntry.changedAt.getTime()
        console.log('⏱️ Calculated duration:', durationInStage)
      }

      const historyData: CreateDealStageHistoryDTO = {
        dealId,
        stageId: newStageId,
        userId,
        durationInStage,
        notes: notes || null,
      }

      console.log('💾 Creating history record:', historyData)
      const result = await this.historyRepository.create(historyData)
      console.log('✅ History record created:', result.id)

      return result
    } catch (error) {
      console.error('❌ Error recording stage change:', error)
      throw error
    }
  }

  async getDealHistory(dealId: string): Promise<DealStageHistoryWithDetails[]> {
    return this.historyRepository.findByDealIdWithDetails(dealId)
  }

  async getDealAnalytics(dealId: string): Promise<DealStageAnalytics> {
    const history = await this.historyRepository.getDealAnalytics(dealId)
    const deal = await this.dealRepository.findById(dealId)

    if (!deal) {
      throw new Error('Deal not found')
    }

    const currentStageDuration = await this.historyRepository.getCurrentStageDuration(dealId)

    // Calculate total duration in pipeline
    let totalDuration = 0
    if (history.length > 0) {
      const firstEntry = history[0]
      const lastEntry = history[history.length - 1]
      totalDuration = lastEntry.changedAt.getTime() - firstEntry.changedAt.getTime()
    }

    return {
      dealId,
      totalStages: history.length,
      totalDuration,
      currentStageDuration,
      stageHistory: history,
    }
  }

  async getStageAnalytics(organizationId: string): Promise<StageDurationAnalytics[]> {
    return this.historyRepository.getStageAnalytics(organizationId)
  }

  async getOrganizationHistory(organizationId: string): Promise<DealStageHistoryWithDetails[]> {
    return this.historyRepository.findByOrganizationId(organizationId)
  }

  async deleteDealHistory(dealId: string): Promise<void> {
    return this.historyRepository.deleteByDealId(dealId)
  }
}
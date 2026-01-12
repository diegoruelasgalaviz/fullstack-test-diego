import type { Deal, CreateDealDTO, UpdateDealDTO, DealRepository, DealQueryOptions, PaginationResult } from '../domain'
import type { DealStageHistoryUseCases } from './DealStageHistoryUseCases'

export class DealUseCases {
  constructor(
    private readonly dealRepository: DealRepository,
    private readonly historyUseCases?: DealStageHistoryUseCases,
  ) {}

  async getAllByOrganization(organizationId: string, options?: DealQueryOptions): Promise<PaginationResult<Deal> | Deal[]> {
    return this.dealRepository.findAllByOrganization(organizationId, options)
  }

  async getDealById(id: string): Promise<Deal | null> {
    return this.dealRepository.findById(id)
  }

  async createDeal(data: CreateDealDTO, userId?: string): Promise<Deal> {
    const deal = await this.dealRepository.create(data)

    // Record initial stage assignment if stage is provided and we have history tracking
    if (data.stageId && userId && this.historyUseCases) {
      await this.historyUseCases.recordStageChange(deal.id, data.stageId, userId, 'Deal created')
    }

    return deal
  }

  async updateDeal(id: string, data: UpdateDealDTO, userId?: string): Promise<Deal | null> {
    console.log('🔄 DealUseCases.updateDeal called:', { id, data, userId: !!userId })

    // Get current deal to check if stage changed
    const currentDeal = await this.dealRepository.findById(id)
    if (!currentDeal) {
      console.log('❌ Deal not found:', id)
      return null
    }

    console.log('📋 Current deal stage:', currentDeal.stageId, 'New stage:', data.stageId)

    // Check if stage has changed
    if (data.stageId !== undefined && data.stageId !== currentDeal.stageId && userId && this.historyUseCases) {
      console.log('🎯 Stage change detected, recording history...')
      // Record the stage change
      await this.historyUseCases.recordStageChange(id, data.stageId, userId)
    } else {
      console.log('⏭️ Stage change condition not met:', {
        stageIdDefined: data.stageId !== undefined,
        stageChanged: data.stageId !== currentDeal.stageId,
        hasUserId: !!userId,
        hasHistoryUseCases: !!this.historyUseCases
      })
    }

    const result = await this.dealRepository.update(id, data)
    console.log('✅ Deal updated:', result?.id)
    return result
  }

  async deleteDeal(id: string): Promise<boolean> {
    return this.dealRepository.delete(id)
  }
}

import { Request, Response } from 'express'
import type { DealStageHistoryUseCases } from '../application/DealStageHistoryUseCases'
import type { AuthenticatedRequest } from '@shared/http/AuthenticatedRequest'

export class DealStageHistoryController {
  constructor(private readonly historyUseCases: DealStageHistoryUseCases) {}

  async getDealHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { dealId } = req.params
      const organizationId = req.user.organizationId

      if (!dealId) {
        res.status(400).json({ error: 'Deal ID is required' })
        return
      }

      // Verify the deal belongs to the user's organization
      // This would be handled by middleware in a production app

      const history = await this.historyUseCases.getDealHistory(dealId)

      res.json({
        dealId,
        history,
        totalEntries: history.length,
      })
    } catch (error) {
      console.error('Failed to get deal history:', error)
      res.status(500).json({ error: 'Failed to retrieve deal history' })
    }
  }

  async getDealAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { dealId } = req.params

      if (!dealId) {
        res.status(400).json({ error: 'Deal ID is required' })
        return
      }

      const analytics = await this.historyUseCases.getDealAnalytics(dealId)

      res.json(analytics)
    } catch (error) {
      console.error('Failed to get deal analytics:', error)
      if (error instanceof Error && error.message === 'Deal not found') {
        res.status(404).json({ error: 'Deal not found' })
        return
      }
      res.status(500).json({ error: 'Failed to retrieve deal analytics' })
    }
  }

  async getStageAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const organizationId = req.user.organizationId

      const analytics = await this.historyUseCases.getStageAnalytics(organizationId)

      res.json({
        organizationId,
        stageAnalytics: analytics,
        totalStages: analytics.length,
      })
    } catch (error) {
      console.error('Failed to get stage analytics:', error)
      res.status(500).json({ error: 'Failed to retrieve stage analytics' })
    }
  }

  async getOrganizationHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const organizationId = req.user.organizationId
      const { limit = '50', offset = '0' } = req.query

      const limitNum = Math.min(parseInt(limit as string) || 50, 100) // Max 100
      const offsetNum = parseInt(offset as string) || 0

      // For now, get all and slice - in production, you'd optimize this query
      const history = await this.historyUseCases.getOrganizationHistory(organizationId)
      const paginatedHistory = history.slice(offsetNum, offsetNum + limitNum)

      res.json({
        organizationId,
        history: paginatedHistory,
        total: history.length,
        limit: limitNum,
        offset: offsetNum,
      })
    } catch (error) {
      console.error('Failed to get organization history:', error)
      res.status(500).json({ error: 'Failed to retrieve organization history' })
    }
  }
}
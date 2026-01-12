import { Router } from 'express'
import type { DealStageHistoryController } from './DealStageHistoryController'
import type { RequestHandler } from 'express'

export function createDealStageHistoryRoutes(
  controller: DealStageHistoryController,
  authMiddleware: RequestHandler,
): Router {
  const router = Router()

  // GET /api/deals/:dealId/history - Get stage history for a specific deal
  router.get('/:dealId/history', authMiddleware, (req, res) =>
    controller.getDealHistory(req as any, res)
  )

  // GET /api/deals/:dealId/analytics - Get analytics for a specific deal
  router.get('/:dealId/analytics', authMiddleware, (req, res) =>
    controller.getDealAnalytics(req as any, res)
  )

  // GET /api/deals/analytics/stage-durations - Get stage duration analytics for organization
  router.get('/analytics/stage-durations', authMiddleware, (req, res) =>
    controller.getStageAnalytics(req as any, res)
  )

  // GET /api/deals/analytics/organization-history - Get organization-wide stage history
  router.get('/analytics/organization-history', authMiddleware, (req, res) =>
    controller.getOrganizationHistory(req as any, res)
  )

  return router
}
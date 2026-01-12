import { Router, type RequestHandler } from 'express'
import type { DealController } from './DealController'
import type { DealStageHistoryController } from './DealStageHistoryController'
import { validateBody } from '@shared/validation'
import { createDealSchema, updateDealSchema } from '@shared/validation'
import { createDealStageHistoryRoutes } from './dealStageHistoryRoutes'

export function createDealRoutes(
  controller: DealController,
  historyController: DealStageHistoryController,
  authMiddleware: RequestHandler
): Router {
  const router = Router()

  // Add stage history routes (these need to come before the generic :id routes)
  const historyRoutes = createDealStageHistoryRoutes(historyController, authMiddleware)
  router.use('/', historyRoutes)

  router.use(authMiddleware)

  router.get('/', (req, res) => controller.getAll(req as any, res))
  router.get('/:id', (req, res) => controller.getById(req as any, res))
  router.post('/', (req, res) => controller.create(req as any, res))
  router.put('/:id', (req, res) => controller.update(req as any, res))
  router.delete('/:id', (req, res) => controller.delete(req as any, res))

  return router
}

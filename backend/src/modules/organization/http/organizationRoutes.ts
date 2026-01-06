import { Router, type RequestHandler } from 'express'
import type { OrganizationController } from './OrganizationController'

export function createOrganizationRoutes(
  controller: OrganizationController,
  authMiddleware: RequestHandler
): Router {
  const router = Router()

  router.use(authMiddleware)

  router.get('/', (req, res) => controller.getById(req as any, res))
  router.put('/', (req, res) => controller.update(req as any, res))

  return router
}

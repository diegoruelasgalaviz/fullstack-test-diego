import { Router, type RequestHandler } from 'express'
import type { ContactController } from './ContactController'

export function createContactRoutes(
  controller: ContactController,
  authMiddleware: RequestHandler
): Router {
  const router = Router()

  router.use(authMiddleware)

  router.get('/', (req, res) => controller.getAll(req as any, res))
  router.get('/:id', (req, res) => controller.getById(req as any, res))
  router.post('/', (req, res) => controller.create(req as any, res))
  router.put('/:id', (req, res) => controller.update(req as any, res))
  router.delete('/:id', (req, res) => controller.delete(req as any, res))

  return router
}

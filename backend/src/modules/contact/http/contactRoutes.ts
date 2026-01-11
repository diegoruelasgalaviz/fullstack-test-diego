import { Router, type RequestHandler } from 'express'
import type { ContactController } from './ContactController'
import { validateBody } from '@shared/validation'
import { createContactSchema, updateContactSchema } from '@shared/validation'

export function createContactRoutes(
  controller: ContactController,
  authMiddleware: RequestHandler
): Router {
  const router = Router()

  router.use(authMiddleware)

  router.get('/', (req, res) => controller.getAll(req as any, res))
  router.get('/:id', (req, res) => controller.getById(req as any, res))
  router.post('/', validateBody(createContactSchema), (req, res) => controller.create(req as any, res))
  router.put('/:id', validateBody(updateContactSchema), (req, res) => controller.update(req as any, res))
  router.delete('/:id', (req, res) => controller.delete(req as any, res))

  return router
}

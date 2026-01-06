import { Router } from 'express'
import type { UserController } from './UserController'

export function createUserRoutes(controller: UserController): Router {
  const router = Router()

  router.get('/', (req, res) => controller.getAll(req, res))
  router.get('/:id', (req, res) => controller.getById(req, res))
  router.post('/', (req, res) => controller.create(req, res))
  router.delete('/:id', (req, res) => controller.delete(req, res))

  return router
}

import { Router, type RequestHandler } from 'express'
import type { AuthController } from './AuthController'
import { validateBody } from '@shared/validation'
import { registerSchema, loginSchema } from '@shared/validation'

export function createAuthRoutes(
  controller: AuthController,
  authMiddleware: RequestHandler
): Router {
  const router = Router()

  // Public routes
  router.post('/register', validateBody(registerSchema), (req, res) => controller.register(req, res))
  router.post('/login', validateBody(loginSchema), (req, res) => controller.login(req, res))
  router.post('/refresh', (req, res) => controller.refresh(req, res))
  router.post('/revoke', (req, res) => controller.revoke(req, res))

  // Protected routes
  router.get('/sessions', authMiddleware, (req, res) => controller.sessions(req, res))
  router.post('/logout-all', authMiddleware, (req, res) => controller.logoutAll(req, res))

  return router
}

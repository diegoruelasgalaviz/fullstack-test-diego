import express, { type Express } from 'express'
import cors from 'cors'
import type { DataSource } from 'typeorm'
import {
  UserUseCases,
  UserEntity,
  PostgresUserRepository,
  UserController,
  createUserRoutes,
} from '@modules/users'
import {
  AuthUseCases,
  PostgresAuthRepository,
  BcryptPasswordHasher,
  JwtTokenGenerator,
  AuthController,
  createAuthRoutes,
} from '@modules/auth'

const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key-change-in-production'

export function createApp(dataSource: DataSource): Express {
  const app = express()

  // Middleware
  app.use(cors())
  app.use(express.json())

  // Users Module - Dependency Injection
  const userRepository = new PostgresUserRepository(
    dataSource.getRepository(UserEntity)
  )
  const userUseCases = new UserUseCases(userRepository)
  const userController = new UserController(userUseCases)

  // Auth Module - Dependency Injection
  const authRepository = new PostgresAuthRepository(
    dataSource.getRepository(UserEntity)
  )
  const passwordHasher = new BcryptPasswordHasher()
  const tokenGenerator = new JwtTokenGenerator(JWT_SECRET)
  const authUseCases = new AuthUseCases(
    authRepository,
    passwordHasher,
    tokenGenerator
  )
  const authController = new AuthController(authUseCases)

  // Routes
  app.use('/api/users', createUserRoutes(userController))
  app.use('/api/auth', createAuthRoutes(authController))

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  return app
}

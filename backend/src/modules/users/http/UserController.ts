import type { Request, Response } from 'express'
import type { UserUseCases } from '../application'

export class UserController {
  constructor(private readonly userUseCases: UserUseCases) {}

  async getAll(_req: Request, res: Response): Promise<void> {
    const users = await this.userUseCases.getAllUsers()
    res.json(users)
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const user = await this.userUseCases.getUserById(id)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json(user)
  }

  async create(req: Request, res: Response): Promise<void> {
    const { name, email } = req.body

    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' })
      return
    }

    const user = await this.userUseCases.createUser({ name, email })
    res.status(201).json(user)
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const deleted = await this.userUseCases.deleteUser(id)

    if (!deleted) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.status(204).send()
  }
}

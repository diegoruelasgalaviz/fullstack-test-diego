import type { User, CreateUserDTO } from './User'

export interface UserRepository {
  findAll(): Promise<User[]>
  findById(id: string): Promise<User | null>
  create(data: CreateUserDTO): Promise<User>
  delete(id: string): Promise<boolean>
}

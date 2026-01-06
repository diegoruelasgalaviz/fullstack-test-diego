import type { User, CreateUserDTO, UserRepository } from '../domain'

export class UserUseCases {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id)
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    return this.userRepository.create(data)
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id)
  }
}

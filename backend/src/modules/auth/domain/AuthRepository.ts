import type { AuthUser, RegisterDTO } from './Auth'

export interface AuthRepository {
  findByEmail(email: string): Promise<AuthUser | null>
  create(data: RegisterDTO & { hashedPassword: string }): Promise<AuthUser>
}

import bcrypt from 'bcryptjs'
import type { PasswordHasher } from '../domain'

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds = 10

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async verify(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}

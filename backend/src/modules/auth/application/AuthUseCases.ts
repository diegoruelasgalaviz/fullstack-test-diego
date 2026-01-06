import type {
  RegisterDTO,
  LoginDTO,
  AuthResponse,
  AuthRepository,
  PasswordHasher,
  TokenGenerator,
} from '../domain'

export class AuthUseCases {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    const hashedPassword = await this.passwordHasher.hash(data.password)

    const user = await this.authRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
      hashedPassword,
    })

    const token = this.tokenGenerator.generate(user.id)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    }
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.authRepository.findByEmail(data.email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await this.passwordHasher.verify(
      data.password,
      user.password
    )
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    const token = this.tokenGenerator.generate(user.id)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    }
  }
}

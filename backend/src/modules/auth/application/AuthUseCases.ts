import type {
  RegisterDTO,
  LoginDTO,
  AuthResponse,
  AuthRepository,
  PasswordHasher,
  TokenGenerator,
  RefreshTokenRepository,
} from '../domain'
import type { OrganizationRepository } from '@modules/organization/domain'
import type { WorkflowRepository } from '@modules/workflow/domain'

export class AuthUseCases {
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 30

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly workflowRepository: WorkflowRepository
  ) {}

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create organization for the new user
    const organization = await this.organizationRepository.create({
      name: `${data.name}'s Organization`,
    })

    // Create default workflow for the organization
    await this.workflowRepository.create({
      organizationId: organization.id,
      name: 'Sales Pipeline',
      stages: [
        { name: 'Lead', order: 1, color: '#6B7280' },
        { name: 'Qualified', order: 2, color: '#3B82F6' },
        { name: 'Proposal', order: 3, color: '#8B5CF6' },
        { name: 'Negotiation', order: 4, color: '#F59E0B' },
        { name: 'Won', order: 5, color: '#10B981' },
        { name: 'Lost', order: 6, color: '#EF4444' },
      ],
    })

    const hashedPassword = await this.passwordHasher.hash(data.password)

    const user = await this.authRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
      hashedPassword,
      organizationId: organization.id,
    })

    const token = this.tokenGenerator.generate(user.id, organization.id)

    // Store refresh token in database
    const refreshTokenExpiresAt = new Date()
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS)

    await this.refreshTokenRepository.create({
      userId: user.id,
      token: token.refreshToken,
      expiresAt: refreshTokenExpiresAt,
      device: null,
      ipAddress: null,
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
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

    if (!user.organizationId) {
      throw new Error('User has no organization')
    }

    const token = this.tokenGenerator.generate(user.id, user.organizationId)

    // Store refresh token in database
    const refreshTokenExpiresAt = new Date()
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS)

    await this.refreshTokenRepository.create({
      userId: user.id,
      token: token.refreshToken,
      expiresAt: refreshTokenExpiresAt,
      device: null,
      ipAddress: null,
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      },
      token,
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const storedToken = await this.refreshTokenRepository.findByToken(refreshToken)

    if (!storedToken) {
      throw new Error('Invalid refresh token')
    }

    if (storedToken.isRevoked) {
      throw new Error('Refresh token has been revoked')
    }

    if (storedToken.expiresAt < new Date()) {
      throw new Error('Refresh token has expired')
    }

    // Get user information
    const user = await this.authRepository.findById(storedToken.userId)
    if (!user || !user.organizationId) {
      throw new Error('User not found or has no organization')
    }

    // Generate new access token
    const newToken = this.tokenGenerator.generate(user.id, user.organizationId)

    // Revoke old refresh token
    await this.refreshTokenRepository.revokeToken(refreshToken)

    // Store new refresh token
    const refreshTokenExpiresAt = new Date()
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS)

    await this.refreshTokenRepository.create({
      userId: user.id,
      token: newToken.refreshToken,
      expiresAt: refreshTokenExpiresAt,
      device: storedToken.device,
      ipAddress: storedToken.ipAddress,
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      },
      token: newToken,
    }
  }

  async revokeToken(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.revokeToken(refreshToken)
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllUserTokens(userId)
  }

  async getUserSessions(userId: string): Promise<Array<{ id: string; device: string | null; ipAddress: string | null; createdAt: Date }>> {
    const tokens = await this.refreshTokenRepository.findByUserId(userId)
    return tokens.map((token) => ({
      id: token.id,
      device: token.device,
      ipAddress: token.ipAddress,
      createdAt: token.createdAt,
    }))
  }
}

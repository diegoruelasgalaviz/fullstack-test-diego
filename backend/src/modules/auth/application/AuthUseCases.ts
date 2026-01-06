import type {
  RegisterDTO,
  LoginDTO,
  AuthResponse,
  AuthRepository,
  PasswordHasher,
  TokenGenerator,
} from '../domain'
import type { OrganizationRepository } from '@modules/organization/domain'
import type { WorkflowRepository } from '@modules/workflow/domain'

export class AuthUseCases {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
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
}

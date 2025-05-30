# Migrating AdonisJS 6 from Classic to Hexagonal Architecture

## Introduction

This document provides a comprehensive guide for migrating an AdonisJS 6 application from its classic MVC architecture to a hexagonal architecture (also known as ports and adapters architecture).

### What is Hexagonal Architecture?

Hexagonal Architecture is a software design pattern that aims to create loosely coupled application components that can be easily connected to their software environment by means of ports and adapters. This architecture allows an application to be equally driven by users, programs, automated tests, or batch scripts, and to be developed and tested in isolation from its eventual run-time devices and databases.

The core principles include:

1. **Separation of concerns**: Clearly separate domain logic from external concerns
2. **Domain-centric**: Business logic is at the center, independent of external systems
3. **Dependency inversion**: Dependencies point inward, with the domain having no knowledge of external systems
4. **Ports and Adapters**: Interfaces (ports) define how the domain interacts with the outside world, while adapters implement these interfaces

## Benefits of Migration

Migrating to a hexagonal architecture offers several advantages:

1. **Improved testability**: Domain logic can be tested in isolation without external dependencies
2. **Enhanced maintainability**: Clear separation of concerns makes the codebase easier to understand and modify
3. **Flexibility**: External components can be replaced without affecting the domain logic
4. **Future-proofing**: The application becomes more resilient to changes in frameworks, databases, or external services
5. **Better organization**: Code is organized by domain concepts rather than technical layers

## Current Architecture

Our current application follows the classic AdonisJS MVC architecture:

```
app/
  controllers/    # Handle HTTP requests and responses
  models/         # Database models
  services/       # Business logic services
  middleware/     # HTTP middleware
  exceptions/     # Custom exception handlers
  validators/     # Input validation
```

In this structure, controllers often directly use models and services, creating tight coupling between the application's layers.

## Target Hexagonal Architecture

We'll reorganize the application into the following structure:

```
app/
  contexts/                          # Domain contexts
    user_management/                 # User management context
      application/                   # Application layer for user management
        use-cases/                   # User management use cases
        dtos/                        # User management DTOs
      interfaces/                    # User management interfaces
        http/                        # HTTP controllers, middleware, validators
        cli/                         # CLI commands

    company_management/              # Company management context
      application/                   # Application layer for company management
        use-cases/                   # Company management use cases
        dtos/                        # Company management DTOs
      interfaces/                    # Company management interfaces
        http/                        # HTTP controllers, middleware, validators
        cli/                         # CLI commands

    // Other contexts like billing, reporting, etc.

  shared/                            # Shared components across contexts
    domain/                          # Core business logic
      entities/                      # Business objects
      repositories/                  # Repository interfaces (ports)
      services/                      # Domain services
      value-objects/                 # Immutable value objects

    infrastructure/                  # External concerns
      repositories/                  # Repository implementations (adapters)
      services/                      # External service implementations
      orm/                           # ORM-specific code

    interfaces/                      # Shared interfaces
      http/                          # Common HTTP components
        middleware/                  # Shared middleware
        validators/                  # Common validators
      cli/                           # Common CLI components
```

This structure follows a domain-driven design approach where:

1. **Contexts**: Each business domain has its own isolated context with its application logic and interfaces
2. **Shared**: Common components that are used across multiple contexts

## Migration Steps

### 1. Create the New Directory Structure

First, create the new directory structure while keeping the existing code in place:

```bash
# Create shared components structure
mkdir -p app/shared/domain/{entities,repositories,services,value-objects}
mkdir -p app/shared/infrastructure/{repositories,services,orm}
mkdir -p app/shared/interfaces/http/{middleware,validators}
mkdir -p app/shared/interfaces/cli

# Create contexts structure
mkdir -p app/contexts/user_management/{application,interfaces}
mkdir -p app/contexts/user_management/application/{use-cases,dtos}
mkdir -p app/contexts/user_management/interfaces/{http,cli}

mkdir -p app/contexts/company_management/{application,interfaces}
mkdir -p app/contexts/company_management/application/{use-cases,dtos}
mkdir -p app/contexts/company_management/interfaces/{http,cli}

# Add more contexts as needed
```

### 2. Define Domain Entities

Identify and create your core domain entities. These should be plain TypeScript classes without ORM decorators.

Example: Converting the User model to a domain entity

**Current User model:**
```typescript
// app/models/user.ts
import { column, BaseModel } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare password: string

  @column.dateTime()
  declare lastLoginAt: DateTime

  // ...other properties and methods
}
```

**New domain entity:**
```typescript
// app/shared/domain/entities/user.ts
import { DateTime } from 'luxon'

export class User {
  constructor(
    public id: number | null,
    public email: string,
    public password: string,
    public lastLoginAt: DateTime | null,
    // ...other properties
  ) {}

  // Domain methods (business logic)
  isActive(): boolean {
    if (!this.lastLoginAt) return false
    return this.lastLoginAt > DateTime.now().minus({ days: 30 })
  }

  // ...other domain methods
}
```

### 3. Define Repository Interfaces (Ports)

Create interfaces for your repositories in the domain layer:

```typescript
// app/shared/domain/repositories/user-repository.interface.ts
import { User } from '../entities/user'

export interface UserRepository {
  findById(id: number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(user: User): Promise<User>
  update(user: User): Promise<User>
  verifyCredentials(email: string, password: string): Promise<User>
  // ...other methods
}
```

### 4. Implement Repository Adapters Using Query Builder

Create implementations of your repository interfaces in the infrastructure layer using the Lucid query builder directly:

```typescript
// app/shared/infrastructure/repositories/database-user-repository.ts
import { UserRepository } from '../../domain/repositories/user-repository.interface'
import { User } from '../../domain/entities/user'
import Database from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

export class DatabaseUserRepository implements UserRepository {
  async findById(id: number): Promise<User | null> {
    const userData = await Database.query()
      .from('users')
      .where('id', id)
      .first()

    if (!userData) return null
    return this.mapToEntity(userData)
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await Database.query()
      .from('users')
      .where('email', email)
      .first()

    if (!userData) return null
    return this.mapToEntity(userData)
  }

  async create(user: User): Promise<User> {
    const [id] = await Database.table('users').insert({
      email: user.email,
      password: user.password,
      last_login_at: user.lastLoginAt,
      // other fields
    }).returning('id')

    return this.findById(id)
  }

  async update(user: User): Promise<User> {
    await Database.from('users')
      .where('id', user.id)
      .update({
        email: user.email,
        password: user.password,
        last_login_at: user.lastLoginAt,
        // other fields
      })

    return this.findById(user.id!)
  }

  async verifyCredentials(email: string, password: string): Promise<User> {
    const userData = await Database.from('users')
      .where('email', email)
      .first()

    if (!userData) {
      throw new Error('User not found')
    }

    const isValid = await hash.verify(userData.password, password)
    if (!isValid) {
      throw new Error('Invalid credentials')
    }

    return this.mapToEntity(userData)
  }

  // Helper method to map database record to domain entity
  private mapToEntity(data: Record<string, any>): User {
    return new User(
      data.id,
      data.email,
      data.password,
      data.last_login_at ? DateTime.fromJSDate(data.last_login_at) : null,
      // other properties
    )
  }
}
```

### 5. Define Database Schema Types

Instead of using ORM models, define TypeScript interfaces that represent your database tables for type safety:

```typescript
// app/shared/infrastructure/database/schemas.ts
import { DateTime } from 'luxon'

export interface UserTable {
  id: number
  email: string
  password: string
  last_login_at: DateTime | null
  // other fields
}

export interface RefreshTokenTable {
  id: number
  user_id: number
  token: string
  expires_at: DateTime
  is_revoked: boolean
  // other fields
}

// Define interfaces for other tables
```

These type definitions can be used with the query builder for type safety:

```typescript
import { UserTable } from '../database/schemas'
import Database from '@adonisjs/lucid/services/db'

// Type-safe query
const users = await Database.from('users')
  .select('*')
  .where('email', 'like', '%@example.com')
  .exec<UserTable[]>()
```

### 6. Create Application Use Cases

Define use cases in the application layer:

```typescript
// app/contexts/user_management/application/use-cases/auth/login-use-case.ts
import { UserRepository } from '../../../../../shared/domain/repositories/user-repository.interface'
import { RefreshTokenRepository } from '../../../../../shared/domain/repositories/refresh-token-repository.interface'
import { TokenService } from '../../../../../shared/domain/services/token-service.interface'
import { LoginDto } from '../../dtos/auth/login.dto'
import { LoginResponseDto } from '../../dtos/auth/login-response.dto'
import { DateTime } from 'luxon'
import * as crypto from 'node:crypto'

export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private tokenService: TokenService
  ) {}

  async execute(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.verifyCredentials(loginDto.email, loginDto.password)

    const accessToken = await this.tokenService.createToken(user, ['*'], {
      expiresIn: '10 minutes',
    })

    const refreshTokenString = crypto.randomBytes(40).toString('hex')
    await this.refreshTokenRepository.create({
      userId: user.id!,
      token: refreshTokenString,
      expiresAt: DateTime.now().plus({ days: 30 }),
      isRevoked: false
    })

    user.lastLoginAt = DateTime.now()
    await this.userRepository.update(user)

    return {
      accessToken: accessToken,
      refreshToken: refreshTokenString
    }
  }
}
```

### 7. Create DTOs (Data Transfer Objects)

Define DTOs for input and output data:

```typescript
// app/contexts/user_management/application/dtos/auth/login.dto.ts
export interface LoginDto {
  email: string
  password: string
}

// app/contexts/user_management/application/dtos/auth/login-response.dto.ts
export interface LoginResponseDto {
  accessToken: string
  refreshToken: string
}
```

### 8. Update Controllers to Use Use Cases

Refactor controllers to use the application use cases:

```typescript
// app/contexts/user_management/interfaces/http/controllers/auth-controller.ts
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { LoginUseCase } from '../../../application/use-cases/auth/login-use-case'
import { RegisterUseCase } from '../../../application/use-cases/auth/register-use-case'
import { loginValidator } from '../validators/auth'

export default class AuthController {
  constructor(
    @inject(LoginUseCase) private loginUseCase: LoginUseCase,
    @inject(RegisterUseCase) private registerUseCase: RegisterUseCase
  ) {}

  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const result = await this.loginUseCase.execute({ email, password })

    return {
      access_token: result.accessToken,
      refresh_token: result.refreshToken
    }
  }

  // Other controller methods...
}
```

### 9. Set Up Dependency Injection

Configure dependency injection to wire everything together:

```typescript
// start/container.ts
import { UserRepository } from '../app/shared/domain/repositories/user-repository.interface'
import { LucidUserRepository } from '../app/shared/infrastructure/repositories/lucid-user-repository'
import { RefreshTokenRepository } from '../app/shared/domain/repositories/refresh-token-repository.interface'
import { LucidRefreshTokenRepository } from '../app/shared/infrastructure/repositories/lucid-refresh-token-repository'
import { TokenService } from '../app/shared/domain/services/token-service.interface'
import { AdonisTokenService } from '../app/shared/infrastructure/services/adonis-token-service'

// User Management Context
import { LoginUseCase } from '../app/contexts/user_management/application/use-cases/auth/login-use-case'
import { RegisterUseCase } from '../app/contexts/user_management/application/use-cases/auth/register-use-case'

export default function setupContainer() {
  // Shared Repositories
  container.bind(UserRepository).to(LucidUserRepository)
  container.bind(RefreshTokenRepository).to(LucidRefreshTokenRepository)

  // Shared Services
  container.bind(TokenService).to(AdonisTokenService)

  // User Management Use Cases
  container.singleton(LoginUseCase)
  container.singleton(RegisterUseCase)
  // ...other bindings
}
```

### 10. Migrate External Services

Refactor external services like the GitHub service:

**Current GitHub service:**
```typescript
// app/services/github_service.ts
import env from '#start/env'

export class GithubService {
  private static headers = {
    Authorization: `Bearer ${env.get('GITHUB_TOKEN')}`,
    Accept: 'application/vnd.github.v3+json',
  }

  public static async listArticlesFiles(): Promise<string[]> {
    // Implementation...
  }

  public static async getFileContent(path: string): Promise<string> {
    // Implementation...
  }
}
```

**New approach:**

1. Define a domain interface:
```typescript
// app/shared/domain/services/github-service.interface.ts
export interface GithubService {
  listArticlesFiles(): Promise<string[]>
  getFileContent(path: string): Promise<string>
}
```

2. Implement the adapter:
```typescript
// app/shared/infrastructure/services/github-service.ts
import { GithubService } from '../../domain/services/github-service.interface'
import env from '#start/env'

export class GithubServiceImpl implements GithubService {
  private headers = {
    Authorization: `Bearer ${env.get('GITHUB_TOKEN')}`,
    Accept: 'application/vnd.github.v3+json',
  }

  private readonly baseUrl = 'https://api.github.com'
  private readonly owner = 'nassimlnd'
  private readonly repo = 'salair'

  public async listArticlesFiles(): Promise<string[]> {
    const response = await fetch(
      `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/frontend/content/articles`,
      {
        headers: this.headers,
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    return (data as any)
      .filter((f: any) => f.type === 'file' && f.name.endsWith('.md'))
      .map((f: any) => f.name.replace('.md', ''))
  }

  public async getFileContent(path: string): Promise<string> {
    const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${path}`

    const response = await fetch(url, {
      headers: this.headers,
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(`Erreur GitHub (${response.status}): ${(err as any).message || 'inconnue'}`)
    }

    const data = await response.json()

    const contentBase64 = (data as any).content as string
    const decoded = Buffer.from(contentBase64, 'base64').toString('utf-8')

    return decoded
  }
}
```

## Migration Strategy

### Incremental Approach

The migration should be done incrementally to minimize disruption:

1. **Start with infrastructure**: Move models to the infrastructure layer first
2. **Create domain entities**: Define your core domain entities
3. **Implement repositories**: Create repository interfaces and implementations
4. **Add use cases**: Implement use cases one by one
5. **Update controllers**: Refactor controllers to use the new use cases
6. **Migrate services**: Move services to the appropriate layers

### Testing Strategy

1. **Write tests for domain entities**: Ensure your domain logic works correctly
2. **Test repositories with in-memory implementations**: Create test doubles for repositories
3. **Test use cases with mock repositories**: Verify application logic
4. **Integration tests**: Test the full flow from controllers to repositories

## Common Challenges and Solutions

### Challenge 1: Circular Dependencies

**Problem**: Domain entities referencing each other can create circular dependencies.

**Solution**: Use interfaces or DTOs to break circular dependencies. Consider using the Aggregate pattern from Domain-Driven Design.

### Challenge 2: Transaction Management

**Problem**: Managing database transactions across multiple repositories when using the query builder directly.

**Solution**: Implement a Unit of Work pattern that manages transactions and passes the transaction object to repositories.

```typescript
// app/shared/domain/services/unit-of-work.interface.ts
export interface UnitOfWork {
  withTransaction<T>(callback: (trx: any) => Promise<T>): Promise<T>
}

// app/shared/infrastructure/services/database-unit-of-work.ts
import Database from '@adonisjs/lucid/services/db'
import { UnitOfWork } from '../../domain/services/unit-of-work.interface'

export class DatabaseUnitOfWork implements UnitOfWork {
  async withTransaction<T>(callback: (trx: any) => Promise<T>): Promise<T> {
    return Database.transaction(async (trx) => {
      return callback(trx)
    })
  }
}
```

Then modify your repositories to accept a transaction object:

```typescript
// app/shared/infrastructure/repositories/database-user-repository.ts
import { UserRepository } from '../../domain/repositories/user-repository.interface'
import { User } from '../../domain/entities/user'
import Database from '@adonisjs/lucid/services/db'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export class DatabaseUserRepository implements UserRepository {
  async create(user: User, trx?: TransactionClientContract): Promise<User> {
    const query = trx ? trx.table('users') : Database.table('users')

    const [id] = await query.insert({
      email: user.email,
      password: user.password,
      // other fields
    }).returning('id')

    return this.findById(id)
  }

  // Other methods with transaction support
}
```

And use it in your use cases:

```typescript
// Example use case with transaction
export class CreateUserWithCompanyUseCase {
  constructor(
    private userRepository: UserRepository,
    private companyRepository: CompanyRepository,
    private unitOfWork: UnitOfWork
  ) {}

  async execute(data: CreateUserWithCompanyDto): Promise<User> {
    return this.unitOfWork.withTransaction(async (trx) => {
      const user = new User(null, data.email, data.password, null)
      const savedUser = await this.userRepository.create(user, trx)

      const company = new Company(null, data.companyName, savedUser.id!)
      await this.companyRepository.create(company, trx)

      return savedUser
    })
  }
}
```

### Challenge 3: Managing Relationships

**Problem**: Without ORM models, handling relationships between entities becomes more manual.

**Solution**: Implement relationship handling in repositories and use explicit joins in queries.

```typescript
// app/shared/infrastructure/repositories/database-user-repository.ts
import { UserRepository } from '../../domain/repositories/user-repository.interface'
import { User } from '../../domain/entities/user'
import { Company } from '../../domain/entities/company'
import Database from '@adonisjs/lucid/services/db'

export class DatabaseUserRepository implements UserRepository {
  // ... other methods

  async findByIdWithCompany(id: number): Promise<User | null> {
    const result = await Database.from('users')
      .where('users.id', id)
      .leftJoin('companies', 'users.id', 'companies.user_id')
      .select('users.*', 'companies.id as company_id', 'companies.name as company_name')
      .first()

    if (!result) return null

    const user = this.mapToEntity(result)

    // If company data exists, create and attach a Company entity
    if (result.company_id) {
      const company = new Company(
        result.company_id,
        result.company_name,
        user.id!
      )
      user.company = company
    }

    return user
  }

  async findWithPaginationAndRelations(page: number, limit: number): Promise<{ data: User[], total: number }> {
    const results = await Database.from('users')
      .leftJoin('companies', 'users.id', 'companies.user_id')
      .select('users.*', 'companies.id as company_id', 'companies.name as company_name')
      .paginate(page, limit)

    const users = results.data.map(result => {
      const user = this.mapToEntity(result)

      if (result.company_id) {
        const company = new Company(
          result.company_id,
          result.company_name,
          user.id!
        )
        user.company = company
      }

      return user
    })

    return {
      data: users,
      total: results.meta.total
    }
  }
}
```

### Challenge 4: Authentication and Authorization

**Problem**: AdonisJS auth is tightly coupled with models.

**Solution**: Create an auth service interface in the domain layer and implement it in the infrastructure layer.

```typescript
// app/shared/domain/services/auth-service.interface.ts
import { User } from '../entities/user'

export interface AuthService {
  authenticate(user: User): Promise<string>
  verify(token: string): Promise<User | null>
  invalidate(token: string): Promise<void>
}

// app/shared/infrastructure/services/adonis-auth-service.ts
import { AuthService } from '../../domain/services/auth-service.interface'
import { User } from '../../domain/entities/user'
import { UserRepository } from '../../domain/repositories/user-repository.interface'
import auth from '@adonisjs/auth/services/main'
import Database from '@adonisjs/lucid/services/db'

export class AdonisAuthService implements AuthService {
  constructor(private userRepository: UserRepository) {}

  async authenticate(user: User): Promise<string> {
    // Create a temporary object that mimics what AdonisJS auth expects
    // This is needed because AdonisJS auth is designed to work with Lucid models
    const authUser = {
      id: user.id,
      email: user.email,
      // Add any other fields required by your auth configuration

      // This method is required by AdonisJS auth
      async verifyPassword(password: string) {
        // In a real implementation, you would verify the password
        // But here we're just authenticating an already verified user
        return true
      }
    }

    const token = await auth.use('api').createToken(authUser)
    return token.value?.release() || ''
  }

  async verify(token: string): Promise<User | null> {
    try {
      const authToken = await auth.use('api').verify(token)
      if (!authToken) return null

      const userId = authToken.user.id
      return this.userRepository.findById(userId)
    } catch (error) {
      return null
    }
  }

  async invalidate(token: string): Promise<void> {
    await auth.use('api').tokenRepository.destroyTokenByValue(token)
  }
}
```

## Database Schema Management

Even though we're not using Lucid ORM models, we still need to manage the database schema. Lucid migrations can still be used for this purpose.

### Using Migrations Without Models

```typescript
// database/migrations/1234_create_users_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.timestamp('last_login_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

### Keeping Schema Types in Sync

To ensure your TypeScript interfaces stay in sync with your database schema, consider creating a script that generates the interfaces from your migrations or database schema. Alternatively, you can manually update the interfaces whenever you change the database schema.

```typescript
// scripts/generate-schema-types.ts
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// This is a simplified example. In a real implementation, you would
// introspect the database schema and generate TypeScript interfaces.
async function generateSchemaTypes() {
  // Get table information from the database
  const tables = await introspectDatabase()

  let output = '// Auto-generated schema types\n'
  output += 'import { DateTime } from \'luxon\'\n\n'

  for (const table of tables) {
    output += `export interface ${pascalCase(table.name)}Table {\n`

    for (const column of table.columns) {
      output += `  ${column.name}: ${mapDbTypeToTs(column.type)}\n`
    }

    output += '}\n\n'
  }

  fs.writeFileSync(
    path.join(process.cwd(), 'app/shared/infrastructure/database/schemas.ts'),
    output
  )

  console.log('Schema types generated successfully')
}

// Helper functions would be implemented here
```

## Conclusion

Migrating to a hexagonal architecture and using Lucid only as a query builder is a significant undertaking, but the benefits in terms of maintainability, testability, and flexibility make it worthwhile. By following this guide, you can successfully transform your AdonisJS application from a classic MVC architecture to a more modular, domain-centric hexagonal architecture.

Key benefits of this approach include:

1. **Clean domain entities**: Your domain entities are pure TypeScript classes without framework-specific decorators
2. **Improved testability**: Easier to mock database interactions for testing
3. **Reduced coupling**: Your application doesn't depend on ORM-specific features
4. **More control**: Direct SQL queries when needed for performance optimization

Remember that this is an incremental process, and it's okay to have parts of your application in the old structure while you gradually migrate to the new architecture. Focus on one domain area at a time, and ensure thorough testing throughout the migration process.

## Resources

- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design by Eric Evans](https://domainlanguage.com/ddd/)
- [AdonisJS Documentation](https://docs.adonisjs.com/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

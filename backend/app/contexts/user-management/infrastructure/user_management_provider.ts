import type { ApplicationService } from '@adonisjs/core/types'
import { AccessTokenManagerContract } from '#contexts/user-management/application/contracts/access_token_manager.contract'
import { AccessTokenManagerAdapter } from '#contexts/user-management/infrastructure/adapters/access_token_manager.adapter'
import { PasswordHashingContract } from '#contexts/user-management/application/contracts/password_hashing.contract'
import { PasswordHashingAdapter } from '#contexts/user-management/infrastructure/adapters/password_hashing.adapter'
import { RefreshTokenRepository } from '#contexts/user-management/application/repositories/refresh_token.repository'
import { LucidRefreshTokenRepository } from '#contexts/user-management/infrastructure/database/repositories/lucid.refresh_token.repository'
import { UserRepository } from '#contexts/user-management/application/repositories/user.repository'
import { LucidUserRepository } from '#contexts/user-management/infrastructure/database/repositories/lucid.user.repository'

export default class UserManagementProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    this.app.container.bind(AccessTokenManagerContract, () => {
      return this.app.container.make(AccessTokenManagerAdapter)
    })

    this.app.container.bind(PasswordHashingContract, () =>
      this.app.container.make(PasswordHashingAdapter)
    )

    this.app.container.bind(RefreshTokenRepository, () => {
      return this.app.container.make(LucidRefreshTokenRepository)
    })

    this.app.container.bind(UserRepository, () => {
      return this.app.container.make(LucidUserRepository)
    })
  }

  /**
   * The application has been booted
   */
  async start() {
    await import('#contexts/user-management/infrastructure/http/routes')
  }
}

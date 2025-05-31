import type { ApplicationService } from '@adonisjs/core/types'
import { AccessTokenManagerContract } from '#contexts/user-management/application/contracts/access_token_manager.contract'
import { AccessTokenManagerAdapter } from '#contexts/user-management/infrastructure/adapters/access_token_manager.adapter'
import { PasswordHashingContract } from '#contexts/user-management/application/contracts/password_hashing.contract'
import { PasswordHashingAdapter } from '#contexts/user-management/infrastructure/adapters/password_hashing.adapter'

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
    await import('#contexts/user-management/infrastructure/http/routes')

    this.app.container.bind(AccessTokenManagerContract, () => {
      return this.app.container.make(AccessTokenManagerAdapter)
    })

    this.app.container.bind(PasswordHashingContract, () =>
      this.app.container.make(PasswordHashingAdapter)
    )
  }
}

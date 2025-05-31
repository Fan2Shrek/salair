import { AccessTokenManagerContract } from '#contexts/user-management/application/contracts/access_token_manager.contract'
import { UserIdentifier } from '#contexts/user-management/domain/value-objects/user_identifier'
import { HttpContext } from '@adonisjs/core/http'
import UserModel from '#contexts/user-management/infrastructure/database/models/user.model'
import User from '#models/user'

export class AccessTokenManagerAdapter implements AccessTokenManagerContract {
  #ctx: HttpContext

  constructor() {
    this.#ctx = HttpContext.getOrFail()
  }

  async generate(userId: UserIdentifier): Promise<string> {
    const user = await UserModel.query().where('id', userId.props.value).first()

    if (!user) {
      throw new Error('User does not exist')
    }

    const token = await this.#ctx.auth.use('api').createToken(user as User)

    return token.value!.valueOf()
  }
}

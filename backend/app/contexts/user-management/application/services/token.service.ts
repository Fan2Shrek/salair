import { AccessTokenRepository } from '#contexts/user-management/application/repositories/access_token.repository'
import { UserIdentifier } from '#contexts/user-management/domain/value-objects/user_identifier'
import { AccessToken } from '#contexts/user-management/domain/entities/access_token'
import { Identifier } from '#shared/domain/identifier'

export class TokenService {
  constructor(private accessTokenRepository: AccessTokenRepository) {}

  generate(_userId: UserIdentifier): AccessToken {
    const accessToken = new AccessToken({
      id: Identifier.generate(),
      token: '',
    })

    this.accessTokenRepository.save(accessToken)

    return accessToken
  }
}

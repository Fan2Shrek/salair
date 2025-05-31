import { AccessTokenRepository } from '#contexts/user-management/application/repositories/access_token.repository'
import { UserIdentifier } from '#contexts/user-management/domain/value-objects/user_identifier'
import { AccessToken } from '#contexts/user-management/domain/entities/access_token'
import { Identifier } from '#shared/domain/identifier'

export class AccessTokenService {
  constructor(private accessTokenRepository: AccessTokenRepository) {}

  async generate(_userId: UserIdentifier): Promise<AccessToken> {
    const accessToken = new AccessToken({
      id: Identifier.generate(),
      token: '',
    })

    await this.accessTokenRepository.save(accessToken)

    return accessToken
  }
}

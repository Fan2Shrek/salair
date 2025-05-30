import { UserIdentifier } from '#contexts/user-management/domain/value-objects/user_identifier'
import { RefreshToken } from '#contexts/user-management/domain/entities/refresh_token'
import { Identifier } from '#shared/domain/identifier'
import { RefreshTokenRepository } from '#contexts/user-management/application/repositories/refresh_token.repository'

export class RefreshTokenService {
  constructor(private refreshTokenRepository: RefreshTokenRepository) {}

  async generate(_userId: UserIdentifier): Promise<RefreshToken> {
    const refreshToken = new RefreshToken({
      id: Identifier.generate(),
      token: '',
    })

    await this.refreshTokenRepository.save(refreshToken)

    return refreshToken
  }
}

import { RefreshTokenRepository } from '#contexts/user-management/application/repositories/refresh_token.repository'
import { RefreshToken } from '#contexts/user-management/domain/entities/refresh_token'
import RefreshTokenModel from '#contexts/user-management/infrastructure/database/models/refresh_token.model'
import { DateTime } from 'luxon'

export class LucidRefreshTokenRepository implements RefreshTokenRepository {
  async save(refreshToken: RefreshToken): Promise<RefreshToken> {
    const tokenModel = await RefreshTokenModel.create({
      id: refreshToken.getIdentifier().props.value,
      token: refreshToken.getToken(),
      userId: refreshToken.getUserId().props.value,
      isRevoked: false,
      expiresAt: DateTime.now().plus({ day: 30 }),
    })

    if (tokenModel) {
      return refreshToken
    } else {
      throw new Error('Unable to refresh token')
    }
  }
}

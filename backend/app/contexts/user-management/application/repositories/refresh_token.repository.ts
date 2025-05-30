import { RefreshToken } from '#contexts/user-management/domain/entities/refresh_token'

export abstract class RefreshTokenRepository {
  abstract save(refreshToken: RefreshToken): Promise<RefreshToken>
}

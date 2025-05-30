import { AccessToken } from '#contexts/user-management/domain/entities/access_token'

export abstract class AccessTokenRepository {
  abstract save(accessToken: AccessToken): Promise<void>
  abstract findById(id: string): Promise<AccessToken | null>
}

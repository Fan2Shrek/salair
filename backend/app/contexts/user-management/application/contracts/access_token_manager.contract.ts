import { UserIdentifier } from '#contexts/user-management/domain/value-objects/user_identifier'

export abstract class AccessTokenManagerContract {
  abstract generate(userId: UserIdentifier): Promise<string>
}

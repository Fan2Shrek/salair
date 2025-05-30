import { Email } from '#contexts/user-management/domain/value-objects/email'
import { User } from '#contexts/user-management/domain/entities/user'
import { UserIdentifier } from '#contexts/user-management/domain/value-objects/user_identifier'

export abstract class UserRepository {
  abstract findByEmail(email: Email): Promise<User | null>
  abstract save(user: User): Promise<User | null>
  abstract findById(id: UserIdentifier): Promise<User | null>
}

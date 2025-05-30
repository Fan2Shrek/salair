import { PlainPassword } from '#contexts/user-management/domain/value-objects/plain_password'
import { HashedPassword } from '#contexts/user-management/domain/value-objects/hashed_password'

export abstract class PasswordHashingContract {
  abstract fakeVerify(): Promise<void>
  abstract verify(plainPassword: PlainPassword, hashedPassword: HashedPassword): Promise<boolean>
}

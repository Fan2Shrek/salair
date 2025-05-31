import { PasswordHashingContract } from '#contexts/user-management/application/contracts/password_hashing.contract'
import { PlainPassword } from '#contexts/user-management/domain/value-objects/plain_password'
import { HashedPassword } from '#contexts/user-management/domain/value-objects/hashed_password'
import hash from '@adonisjs/core/services/hash'

export class PasswordHashingAdapter implements PasswordHashingContract {
  async fakeVerify(): Promise<void> {
    await hash.make('fake')
  }

  async hash(plainPassword: PlainPassword): Promise<HashedPassword> {
    const hashedPassword = await hash.make(plainPassword.toString())

    return HashedPassword.fromString(hashedPassword)
  }

  verify(plainPassword: PlainPassword, hashedPassword: HashedPassword): Promise<boolean> {
    return hash.verify(hashedPassword.toString(), plainPassword.toString())
  }
}

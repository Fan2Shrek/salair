import { Email } from '#contexts/user-management/domain/value-objects/email'
import { HashedPassword } from '#contexts/user-management/domain/value-objects/hashed_password'

export class AuthenticationRequestDTO {
  constructor(
    public email: Email,
    public password: HashedPassword
  ) {}
}

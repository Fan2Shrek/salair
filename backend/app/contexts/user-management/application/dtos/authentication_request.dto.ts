import { Email } from '#contexts/user-management/domain/value-objects/email'
import { PlainPassword } from '#contexts/user-management/domain/value-objects/plain_password'

export class AuthenticationRequestDTO {
  constructor(
    public email: Email,
    public password: PlainPassword
  ) {}
}

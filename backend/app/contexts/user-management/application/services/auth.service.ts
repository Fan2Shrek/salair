import { AuthenticationRequestDTO } from '#contexts/user-management/application/dtos/authentication_request.dto'
import { UserRepository } from '#contexts/user-management/application/repositories/user.repository'
import { InvalidCredentialsException } from '#contexts/user-management/application/exceptions/invalid_credentials.exception'

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async authenticate(payload: AuthenticationRequestDTO) {
    const user = await this.userRepository.findByEmail(payload.email)

    if (!user) {
      throw new InvalidCredentialsException()
    }
  }
}

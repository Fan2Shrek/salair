import { AuthenticationRequestDTO } from '#contexts/user-management/application/dtos/authentication_request.dto'
import { AuthService } from '#contexts/user-management/application/services/auth.service'

export class AuthenticationWithEmailPasswordUseCase {
  constructor(private authService: AuthService) {}

  execute(payload: AuthenticationRequestDTO) {
    return this.authService.authenticate(payload)
  }
}

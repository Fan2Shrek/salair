import { AuthenticationRequestDTO } from '#contexts/user-management/application/dtos/authentication_request.dto'
import { UserRepository } from '#contexts/user-management/application/repositories/user.repository'
import { InvalidCredentialsException } from '#contexts/user-management/application/exceptions/invalid_credentials.exception'
import { PasswordHashingContract } from '#contexts/user-management/application/contracts/password_hashing.contract'
import { AuthenticationResponseDTO } from '#contexts/user-management/application/dtos/authentication_response.dto'
import { RefreshTokenService } from '#contexts/user-management/application/services/refresh_token.service'
import { AccessTokenManagerContract } from '#contexts/user-management/application/contracts/access_token_manager.contract'
import { inject } from '@adonisjs/core'

@inject()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private passwordHashingContract: PasswordHashingContract,
    private refreshTokenService: RefreshTokenService,
    private accessTokenManager: AccessTokenManagerContract
  ) {}

  async authenticate(payload: AuthenticationRequestDTO): Promise<AuthenticationResponseDTO> {
    const user = await this.userRepository.findByEmail(payload.email)

    if (!user) {
      // This is a fake verification to prevent timing attacks
      await this.passwordHashingContract.fakeVerify()

      throw new InvalidCredentialsException()
    }

    const isPasswordValid = await this.passwordHashingContract.verify(
      payload.password,
      user.getPassword()
    )

    if (!isPasswordValid) {
      throw new InvalidCredentialsException()
    }

    const refreshToken = await this.refreshTokenService.generate(user.getIdentifier())
    const accessToken = await this.accessTokenManager.generate(user.getIdentifier())

    return {
      accessToken,
      refreshToken: refreshToken.getToken(),
    }
  }
}

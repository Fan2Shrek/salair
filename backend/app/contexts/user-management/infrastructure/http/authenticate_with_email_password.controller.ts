import { inject } from '@adonisjs/core'
import { AuthenticationWithEmailPasswordUseCase } from '#contexts/user-management/application/use-cases/authentication_with_email_password.usecase'
import { HttpContext } from '@adonisjs/core/http'
import { AuthenticationRequestDTO } from '#contexts/user-management/application/dtos/authentication_request.dto'

@inject()
export default class AuthenticateWithEmailPasswordController {
  constructor(protected useCase: AuthenticationWithEmailPasswordUseCase) {}

  async execute({ request, response }: HttpContext) {
    const payload = request.only(['email', 'password'])
    const dto = new AuthenticationRequestDTO(payload.email, payload.password)

    try {
      await this.useCase.execute(dto)
    } catch (error) {
      console.error('Unable to retrieve authentication request', error)
      response.internalServerError('Unable to retrieve authentication request')
    }
  }
}

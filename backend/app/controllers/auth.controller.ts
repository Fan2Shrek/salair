import {
  changePasswordValidator,
  checkValidator,
  loginValidator,
  registerValidator,
  resetValidator,
  verifyResetValidator,
} from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth.service'
import PasswordResetService from '#services/password_reset.service'
import ErrorService from '#services/error.service'

export default class AuthController {
  async register({ request, auth, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)
      const tokens = await AuthService.register(data, auth)
      return response.created(tokens)
    } catch (error) {
      return ErrorService.handleServiceException(response, error)
    }
  }

  async login({ request, auth, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const result = await AuthService.login(email, password, auth)

      if (result.twoFactorRequired) {
        return response.ok({ twoFactorRequired: true })
      }

      return response.ok(result.tokens)
    } catch (error) {
      return ErrorService.handleServiceException(response, error)
    }
  }

  async verify2fa({ request, response, auth }: HttpContext) {
    try {
      const { email, token: totpToken } = request.only(['email', 'token'])
      const tokens = await AuthService.verify2FA(email, totpToken, auth)
      return response.ok(tokens)
    } catch (error) {
      return ErrorService.handleServiceException(response, error)
    }
  }

  async logout({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const { refreshToken: refreshTokenString } = request.only(['refreshToken'])

      if (!refreshTokenString) {
        return ErrorService.validation(response, 'Refresh token is required')
      }

      await AuthService.logout(user, refreshTokenString, auth)
      return response.ok({ message: 'Successfully logged out' })
    } catch (error) {
      return ErrorService.handleServiceException(response, error)
    }
  }

  async refresh({ request, response, auth }: HttpContext) {
    try {
      const { refresh_token: refreshToken } = request.only(['refresh_token'])
      const tokens = await AuthService.refreshTokens(refreshToken, auth)
      return response.ok(tokens)
    } catch (error) {
      return ErrorService.handleServiceException(response, error)
    }
  }

  async check({ request, response }: HttpContext) {
    try {
      const { email } = await request.validateUsing(checkValidator)
      const result = await AuthService.checkEmail(email)
      return response.ok(result)
    } catch (error) {
      return ErrorService.handleServiceException(response, error)
    }
  }

  async reset({ request, response }: HttpContext) {
    try {
      const { email } = await request.validateUsing(resetValidator)
      await PasswordResetService.sendResetEmail(email)
      return response.ok({ message: 'Reset email sent successfully' })
    } catch (error) {
      return ErrorService.handleServiceException(response, error)
    }
  }

  async verifyReset({ request, response }: HttpContext) {
    try {
      const { email, code } = await request.validateUsing(verifyResetValidator)
      await PasswordResetService.verifyResetCode(email, code)
      return response.ok({ message: 'Code valid' })
    } catch (error) {
      return ErrorService.handleServiceException(response, error)
    }
  }

  async changePasswordAfterReset({ request, response }: HttpContext) {
    try {
      const { email, code, password } = await request.validateUsing(changePasswordValidator)
      const user = await PasswordResetService.changePasswordAfterReset(email, code, password)
      return response.ok({ user, message: 'Password updated successfully' })
    } catch (error) {
      return ErrorService.handleServiceException(response, error)
    }
  }
}

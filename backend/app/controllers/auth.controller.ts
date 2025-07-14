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

export default class AuthController {
  async register({ request, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    return await AuthService.register(data, auth)
  }

  async login({ request, auth, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const result = await AuthService.login(email, password, auth)

      if (result.twoFactorRequired) {
        return response.ok({ twoFactorRequired: true })
      }

      return response.ok(result.tokens)
    } catch (error) {
      return response.forbidden({ message: error.message })
    }
  }

  async verify2fa({ request, response, auth }: HttpContext) {
    const { email, token: totpToken } = request.only(['email', 'token'])

    try {
      const tokens = await AuthService.verify2FA(email, totpToken, auth)
      return response.ok(tokens)
    } catch (error) {
      return response.unauthorized({ message: error.message })
    }
  }

  async logout({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const { refreshToken: refreshTokenString } = request.only(['refreshToken'])

    if (!refreshTokenString) {
      return response.badRequest({ message: 'Refresh token is required' })
    }

    await AuthService.logout(user, refreshTokenString, auth)
    return { message: 'success' }
  }

  async refresh({ request, response, auth }: HttpContext) {
    const { refresh_token: refreshToken } = request.only(['refresh_token'])

    try {
      const tokens = await AuthService.refreshTokens(refreshToken, auth)
      return tokens
    } catch (error) {
      return response.unauthorized(error.message)
    }
  }

  async check({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(checkValidator)
    const result = await AuthService.checkEmail(email)
    return response.ok(result)
  }

  async reset({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(resetValidator)

    try {
      await PasswordResetService.sendResetEmail(email)
      return response.ok({})
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  async verifyReset({ request, response }: HttpContext) {
    const { email, code } = await request.validateUsing(verifyResetValidator)

    try {
      await PasswordResetService.verifyResetCode(email, code)
      return response.ok({ message: 'Code valid' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  async changePasswordAfterReset({ request, response }: HttpContext) {
    const { email, code, password } = await request.validateUsing(changePasswordValidator)

    try {
      const user = await PasswordResetService.changePasswordAfterReset(email, code, password)
      return response.ok({ user })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}

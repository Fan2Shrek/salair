import RefreshToken from '#models/refresh_token'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import * as crypto from 'node:crypto'

export default class AuthController {
  async register({ request }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create(data)

    return User.accessTokens.create(user)
  }

  async login({ request, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    const accessToken = await auth.use('api').createToken(user)
    const refreshTokenString = crypto.randomBytes(40).toString('hex')
    await RefreshToken.create({
      userId: user.id,
      token: refreshTokenString,
      expiresAt: DateTime.now().plus({ days: 30 }),
    })

    return {
      access_token: accessToken.value?.release(),
      refresh_token: refreshTokenString,
    }
  }

  async logout({ auth }: HttpContext) {
    await auth.use('api').invalidateToken()

    return { message: 'success' }
  }

  async me({ auth, response }: HttpContext) {
    if (!auth.user) {
      return response.status(401).send({ message: 'JWT not valid or missing' })
    }

    return {
      user: auth.user,
    }
  }

  async refresh({ request, response, auth }: HttpContext) {
    const { refresh_token: refreshToken } = request.only(['refresh_token'])

    const token = await RefreshToken.query()
      .where('token', refreshToken)
      .where('is_revoked', false)
      .where('expires_at', '>', DateTime.now().toSQL())
      .first()

    if (!token) {
      return response.unauthorized('Invalid or expired refresh token')
    }

    const user = await token.related('user').query().firstOrFail()

    token.isRevoked = true
    await token.save()

    const newAccessToken = await auth.use('api').createToken(user)
    const newRefreshToken = crypto.randomBytes(40).toString('hex')

    await RefreshToken.create({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: DateTime.now().plus({ days: 30 }),
    })

    return {
      access_token: newAccessToken.value?.release(),
      refresh_token: newRefreshToken,
    }
  }
}

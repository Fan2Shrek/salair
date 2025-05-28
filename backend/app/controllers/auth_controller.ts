import RefreshToken from '#models/refresh_token'
import User from '#models/user'
import { changePasswordValidator, loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import * as crypto from 'node:crypto'
import { generateSixDigitCode } from '#utils/number'
import hash from '@adonisjs/core/services/hash'
import PasswordReset from '#models/password_reset'
import mail from '@adonisjs/mail/services/main'

export default class AuthController {
  async register({ request, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create(data)

    const accessToken = await auth.use('api').createToken(user, ['*'], {
      expiresIn: '10 minutes',
    })

    const refreshTokenString = crypto.randomBytes(40).toString('hex')
    await RefreshToken.create({
      userId: user.id,
      token: refreshTokenString,
      expiresAt: DateTime.now().plus({ days: 30 }),
    })

    user.lastLoginAt = DateTime.now()
    await user.save()

    return {
      access_token: accessToken.value?.release(),
      refresh_token: refreshTokenString,
    }
  }

  async login({ request, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    const accessToken = await auth.use('api').createToken(user, ['*'], {
      expiresIn: '10 minutes',
    })
    const refreshTokenString = crypto.randomBytes(40).toString('hex')
    await RefreshToken.create({
      userId: user.id,
      token: refreshTokenString,
      expiresAt: DateTime.now().plus({ days: 30 }),
    })

    user.lastLoginAt = DateTime.local()
    await user.save()

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

    await auth.user.load('company')

    return auth.user
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

  async check({ request, response }: HttpContext) {
    const { email } = request.only(['email'])

    if (!email || typeof email !== 'string') {
      return response.badRequest({ message: 'Invalid email' })
    }

    const user = await User.findBy('email', email)

    return response.ok({
      exists: !!user,
      message: user ? 'Email already used.' : 'Email available.',
    })
  }

  async reset({ request, response }: HttpContext) {
    const { email } = request.only(['email'])

    if (!email || typeof email !== 'string') {
      return response.badRequest({ message: 'Invalid email' })
    }

    const user = await User.findBy('email', email)

    if (user) {
      const code = generateSixDigitCode()
      const hashedCode = await hash.use('scrypt').make(code)

      await PasswordReset.query().where('email', email).where('used', false).delete()

      await PasswordReset.create({
        email,
        code: hashedCode,
        expiresAt: DateTime.now().plus({ minutes: 15 }),
      })

      await mail.send((message) => {
        message
          .to(user.email)
          .from('Salair <noreply@salair.fr>')
          .subject('Demande de réinitialisation de mot de passe')
          .htmlView('mails/reset_password', { code, user: user })
      })

      return response.ok({})
    } else {
      return response.badRequest({ message: 'Inexistant user' })
    }
  }

  async verifyReset({ request, response }: HttpContext) {
    const { email, code } = request.only(['email', 'code'])

    if (!email || !code || typeof email !== 'string' || typeof code !== 'string') {
      return response.badRequest({ message: 'Bad request' })
    }

    const passwordReset = await PasswordReset.query()
      .where('email', email)
      .where('used', false)
      .firstOrFail()

    if (!passwordReset) {
      return response.badRequest('No password reset request detected for this email')
    }

    const isValid = await hash.use('scrypt').verify(passwordReset.code, code)

    if (isValid) {
      return response.ok({ message: 'Code valid' })
    } else {
      return response.badRequest({ message: 'Code invalid' })
    }
  }

  async changePasswordAfterReset({ request, response }: HttpContext) {
    const { email, code, password } = await request.validateUsing(changePasswordValidator)

    const passwordReset = await PasswordReset.query()
      .where('email', email)
      .where('used', false)
      .first()

    if (!passwordReset) {
      return response.badRequest({ message: 'No password reset request detected for this email' })
    }

    const isCodeValid = await hash.use('scrypt').verify(passwordReset.code, code)
    if (!isCodeValid) {
      return response.badRequest({ message: 'Code invalid' })
    }

    const user = await User.findBy('email', email)
    if (!user) {
      return response.badRequest({ message: 'No user found with this email' })
    }

    user.password = password
    await user.save()

    passwordReset.used = true
    await passwordReset.save()

    return response.ok({ user })
  }
}

import RefreshToken from '#models/refresh_token'
import User from '#models/user'
import ErrorService from '#services/error.service'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import * as crypto from 'node:crypto'
import { authenticator } from 'otplib'

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface LoginResult {
  tokens?: AuthTokens
  twoFactorRequired?: boolean
}

export class AuthService {
  /**
   * Create access and refresh tokens for a user
   */
  async createTokens(user: User, auth: HttpContext['auth']): Promise<AuthTokens> {
    const accessToken = await auth.use('api').createToken(user, ['*'], {
      expiresIn: '10 minutes',
    })

    const refreshTokenString = crypto.randomBytes(40).toString('hex')
    await RefreshToken.create({
      userId: user.id,
      token: refreshTokenString,
      expiresAt: DateTime.now().plus({ days: 30 }),
    })

    // Update last login
    user.lastLoginAt = DateTime.now()
    await user.save()

    return {
      access_token: accessToken.value?.release()!,
      refresh_token: refreshTokenString,
    }
  }

  /**
   * Register a new user and return tokens
   */
  async register(userData: any, auth: HttpContext['auth']): Promise<AuthTokens> {
    const user = await User.create(userData)
    return this.createTokens(user, auth)
  }

  /**
   * Login user with email and password
   */
  async login(email: string, password: string, auth: HttpContext['auth']): Promise<LoginResult> {
    const user = await User.verifyCredentials(email, password)

    if (user.status === 'suspended') {
      throw ErrorService.createAuthorizationError('Account suspended')
    }

    if (user.isTwoFactorEnabled) {
      return { twoFactorRequired: true }
    }

    const tokens = await this.createTokens(user, auth)
    return { tokens }
  }

  /**
   * Verify 2FA token and login user
   */
  async verify2FA(
    email: string,
    totpToken: string,
    auth: HttpContext['auth']
  ): Promise<AuthTokens> {
    const user = await User.findBy('email', email)
    if (!user) {
      throw ErrorService.createNotFoundError('User not found')
    }

    if (!user.isTwoFactorEnabled || !user.twoFactorSecret) {
      throw ErrorService.createBusinessError('2FA is not enabled for this user')
    }

    const isValid = authenticator.verify({ token: totpToken, secret: user.twoFactorSecret })
    if (!isValid) {
      throw ErrorService.createAuthError('Invalid 2FA token')
    }

    return this.createTokens(user, auth)
  }

  /**
   * Logout user by invalidating tokens
   */
  async logout(user: User, refreshTokenString: string, auth: HttpContext['auth']): Promise<void> {
    await auth.use('api').invalidateToken()

    const refreshToken = await RefreshToken.query()
      .where('user_id', user.id)
      .where('token', refreshTokenString)
      .where('is_revoked', false)
      .first()

    if (refreshToken) {
      refreshToken.isRevoked = true
      await refreshToken.save()
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(refreshTokenString: string, auth: HttpContext['auth']): Promise<AuthTokens> {
    const token = await RefreshToken.query()
      .where('token', refreshTokenString)
      .where('is_revoked', false)
      .where('expires_at', '>', DateTime.now().toSQL())
      .first()

    if (!token) {
      throw ErrorService.createAuthError('Invalid or expired refresh token')
    }

    const user = await token.related('user').query().firstOrFail()

    // Revoke old refresh token
    token.isRevoked = true
    await token.save()

    // Create new tokens
    const newAccessToken = await auth.use('api').createToken(user)
    const newRefreshToken = crypto.randomBytes(40).toString('hex')

    await RefreshToken.create({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: DateTime.now().plus({ days: 30 }),
    })

    return {
      access_token: newAccessToken.value?.release()!,
      refresh_token: newRefreshToken,
    }
  }

  /**
   * Check if email exists
   */
  async checkEmail(email: string): Promise<{ exists: boolean; message: string }> {
    const user = await User.findBy('email', email)
    return {
      exists: !!user,
      message: user ? 'Email already used.' : 'Email available.',
    }
  }
}

export default new AuthService()

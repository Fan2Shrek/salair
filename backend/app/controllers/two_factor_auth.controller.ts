import type { HttpContext } from '@adonisjs/core/http'
import ErrorService from '#services/error.service'
import { authenticator } from 'otplib'
import qrcode from 'qrcode'

export default class TwoFactorAuthController {
  /**
   * Generate the secret and the QR Code for the authenticated user
   */
  async generate({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const secret = authenticator.generateSecret()
      user.twoFactorSecret = secret
      await user.save()

      const otpauth = authenticator.keyuri(user.email, 'Salair', secret)
      const qrCodeDataUrl = await qrcode.toDataURL(otpauth)

      return response.ok({ qrCodeDataUrl, secret })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to generate 2FA secret')
    }
  }

  /**
   * Validate the token and activate the 2FA
   */
  async enable({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const { token } = request.only(['token'])

      if (!user.twoFactorSecret) {
        return ErrorService.twoFactorSecretNotGenerated(response)
      }

      const isValid = authenticator.verify({ token, secret: user.twoFactorSecret })

      if (!isValid) {
        return ErrorService.invalidTwoFactorToken(response)
      }

      user.isTwoFactorEnabled = true
      await user.save()

      return response.ok({ message: '2FA has been enabled' })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to enable 2FA')
    }
  }

  /**
   * Disable the 2FA
   */
  async disable({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      user.isTwoFactorEnabled = false
      user.twoFactorSecret = null

      await user.save()

      return response.ok({ message: '2FA has been disabled' })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to disable 2FA')
    }
  }
}

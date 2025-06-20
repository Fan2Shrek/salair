import type { HttpContext } from '@adonisjs/core/http'
import { authenticator } from 'otplib'
import qrcode from 'qrcode'

export default class TwoFactorAuthController {
  /**
   * Generate the secret and the QR Code for the authenticated user
   */
  async generate({ auth, response }: HttpContext) {
    const user = auth.user!
    const secret = authenticator.generateSecret()
    user.twoFactorSecret = secret
    await user.save()

    const otpauth = authenticator.keyuri(user.email, 'Salair', secret)
    const qrCodeDataUrl = await qrcode.toDataURL(otpauth)

    return response.ok({ qrCodeDataUrl, secret })
  }

  /**
   * Validate the token and activate the 2FA
   */
  async enable({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { token } = request.only(['token'])

    if (!user.twoFactorSecret) {
      return response.badRequest({ message: '2FA secret not generated yet.' })
    }

    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret })

    if (!isValid) {
      return response.badRequest({ message: 'Invalid 2FA token.' })
    }

    user.isTwoFactorEnabled = true
    await user.save()

    return response.ok({ message: '2FA has been enabled.' })
  }

  /**
   * Disable the 2FA
   */
  async disable({ auth, response }: HttpContext) {
    const user = auth.user!
    user.isTwoFactorEnabled = false
    user.twoFactorSecret = null

    await user.save()

    return response.ok({ message: '2FA has been disabled.' })
  }
}

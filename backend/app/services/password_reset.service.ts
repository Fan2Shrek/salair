import User from '#models/user'
import PasswordReset from '#models/password_reset'
import { generateSixDigitCode } from '#utils/number'
import hash from '@adonisjs/core/services/hash'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'

export class PasswordResetService {
  /**
   * Send password reset email with code
   */
  async sendResetEmail(email: string): Promise<void> {
    const user = await User.findBy('email', email)
    if (!user) {
      throw new Error('Inexistant user')
    }

    const code = generateSixDigitCode()
    const hashedCode = await hash.use('scrypt').make(code)

    // Delete existing unused reset requests
    await PasswordReset.query().where('email', email).where('used', false).delete()

    // Create new reset request
    await PasswordReset.create({
      email,
      code: hashedCode,
      expiresAt: DateTime.now().plus({ minutes: 15 }),
    })

    // Send email
    await mail.send((message) => {
      message
        .to(user.email)
        .from('Salair <noreply@salair.fr>')
        .subject('Demande de réinitialisation de mot de passe')
        .htmlView('mails/reset_password', { code, user })
    })
  }

  /**
   * Verify reset code
   */
  async verifyResetCode(email: string, code: string): Promise<void> {
    const passwordReset = await PasswordReset.query()
      .where('email', email)
      .where('used', false)
      .first()

    if (!passwordReset) {
      throw new Error('No password reset request detected for this email')
    }

    const isCodeValid = await hash.use('scrypt').verify(passwordReset.code, code)
    if (!isCodeValid) {
      throw new Error('Code invalid')
    }
  }

  /**
   * Change password after reset code verification
   */
  async changePasswordAfterReset(email: string, code: string, newPassword: string): Promise<User> {
    // Verify code first
    await this.verifyResetCode(email, code)

    const user = await User.findBy('email', email)
    if (!user) {
      throw new Error('No user found with this email')
    }

    // Update password
    user.password = newPassword
    await user.save()

    // Mark reset request as used
    const passwordReset = await PasswordReset.query()
      .where('email', email)
      .where('used', false)
      .first()

    if (passwordReset) {
      passwordReset.used = true
      await passwordReset.save()
    }

    return user
  }
}

export default new PasswordResetService()

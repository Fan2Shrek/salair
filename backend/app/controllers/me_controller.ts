import { AvatarService } from '#services/avatar_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class MeController {
  private avatarService = new AvatarService()

  /**
   * Met à jour l'utilisateur connecté
   */
  async update({ request, response, auth }: HttpContext) {
    const user = auth.user!

    try {
      const userData = request.only(['firstName', 'lastName', 'email', 'phoneNumber', 'avatar'])

      user.merge(userData)
      await user.save()

      if (user.role !== 'admin') {
        await user.load('company')
      }

      return response.ok(user)
    } catch (error) {
      return response.notFound({ message: 'Utilisateur non trouvé' })
    }
  }

  /**
   * Met à jour spécifiquement l'avatar d'un utilisateur
   */
  async updateAvatar({ auth, request, response }: HttpContext) {
    const user = auth.user!

    try {
      const avatarFile = request.file('file', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (!avatarFile) {
        return response.badRequest({ message: 'File is required' })
      }

      const validation = this.avatarService.validateAvatarFile(avatarFile)
      if (!validation.isValid) {
        return response.badRequest({
          message: validation.message,
          errors: validation.errors,
        })
      }

      const avatarUrl = await this.avatarService.updateUserAvatar(user, avatarFile)

      return response.ok({ message: 'Avatar updated', user, avatar_url: avatarUrl })
    } catch (error) {
      return response.notFound({ message: 'Utilisateur non trouvé' })
    }
  }
}

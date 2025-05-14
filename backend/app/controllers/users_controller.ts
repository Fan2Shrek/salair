import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { randomUUID } from 'node:crypto'

export default class UsersController {
  /**
   * Affiche une liste de tous les utilisateurs
   */
  async index({ response }: HttpContext) {
    const users = await User.query()
    return response.ok(users)
  }

  /**
   * Affiche un utilisateur spécifique
   */
  async show({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      return response.ok(user)
    } catch (error) {
      return response.notFound({ message: 'Utilisateur non trouvé' })
    }
  }

  /**
   * Crée un nouvel utilisateur
   */
  async store({ request, response }: HttpContext) {
    const userData = request.only(['firstName', 'lastName', 'email', 'password', 'phoneNumber'])

    try {
      const user = await User.create(userData)
      return response.created(user)
    } catch (error) {
      return response.badRequest({
        message: "Impossible de créer l'utilisateur",
        error: error.message,
      })
    }
  }

  /**
   * Met à jour un utilisateur existant
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      const userData = request.only([
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'avatar',
        'isVerified',
      ])

      user.merge(userData)
      await user.save()

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
      const avatarFile = request.file('avatar', {
        size: '2mb', // Limit file size to 2MB
        extnames: ['jpg', 'jpeg', 'png', 'webp'], // Allow only image files
      })

      if (!avatarFile || !avatarFile.isValid) {
        return response.badRequest({
          message:
            'Invalid file. Please provide a valid image file (jpg, jpeg, png, webp) under 2MB.',
          errors: avatarFile?.errors || [],
        })
      }

      const filename = `${randomUUID()}.${avatarFile.extname}`
      const key = `users/${user.id}/logos/${filename}`

      await avatarFile.moveToDisk(key)

      user.avatar = avatarFile.meta.url
      await user.save()

      return response.ok(user)
    } catch (error) {
      return response.notFound({ message: 'Utilisateur non trouvé' })
    }
  }

  /**
   * Supprime un utilisateur
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()

      return response.noContent()
    } catch (error) {
      return response.notFound({ message: 'Utilisateur non trouvé' })
    }
  }
}

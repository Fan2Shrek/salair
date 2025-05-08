import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

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

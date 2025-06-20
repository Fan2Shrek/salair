import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
// import { UserService } from '#services/user_service'
// import { filterParamsSchema } from '#validators/admin/user'

export default class UsersAdminController {
  async index({ response }: HttpContext) {
    const users = await User.query().orderBy('created_at', 'asc')

    return response.ok(users)

    // const filters = await request.validateUsing(filterParamsSchema)
    // return await UserService.getFilteredUsers(filters)
  }

  async show({ response, params }: HttpContext) {
    const id = params.id

    const user = await User.query().where('id', id).preload('company').first()

    if (!user) {
      return response.notFound()
    }

    return response.ok(user)
  }

  async suspend({ response, params }: HttpContext) {
    const id = params.id

    if (!id) {
      return response.badRequest({ message: 'The id is required.' })
    }

    const user = await User.query().where('id', id).first()

    if (!user) {
      return response.notFound()
    }

    user.status = 'suspended'
    await user.save()

    return response.ok(user)
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
      const userData = request.only(['firstName', 'lastName', 'email', 'phoneNumber', 'avatar'])

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
      const avatarFile = request.file('file', {
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

      return response.ok({ user, avatar_url: user.avatar })
    } catch (error) {
      return response.notFound({ message: 'Utilisateur non trouvé' })
    }
  }

  /**
   * Supprime un utilisateur (soft delete)
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

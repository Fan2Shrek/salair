import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import { randomUUID } from 'node:crypto'

const PUBLIC_BUCKET_URL = env.get('PUBLIC_BUCKET_URL')

export default class MeController {
  /**
   * Met à jour l'utilisateur connecté
   */
  async update({ request, response, auth }: HttpContext) {
    const user = auth.user!

    try {
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
    const disk = drive.use('s3')

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

      if (user.avatar) {
        const key = user.avatar.split(PUBLIC_BUCKET_URL + '/')[1]
        await disk.delete(key)
      }

      const filename = `${randomUUID()}.${avatarFile.extname}`
      const key = `users/${user.id}/logos/${filename}`

      await avatarFile.moveToDisk(key)

      const fileUrl = `${PUBLIC_BUCKET_URL}/${key}`

      user.avatar = fileUrl
      await user.save()

      return response.ok({ user, avatar_url: user.avatar })
    } catch (error) {
      return response.notFound({ message: 'Utilisateur non trouvé' })
    }
  }
}

import User from '#models/user'
import env from '#start/env'
import { MultipartFile } from '@adonisjs/core/types/bodyparser'
import drive from '@adonisjs/drive/services/main'
import { randomUUID } from 'node:crypto'

const PUBLIC_BUCKET_URL = env.get('PUBLIC_BUCKET_URL')

export class AvatarService {
  private disk = drive.use('s3')

  /**
   * Met à jour l'avatar d'un utilisateur
   */
  async updateUserAvatar(user: User, avatarFile: MultipartFile) {
    await this.deleteOldAvatar(user)

    // Upload du nouveau fichier
    const fileUrl = await this.uploadAvatar(avatarFile, user)

    // Mise à jour de l'utilisateur
    user.avatar = fileUrl
    await user.save()

    return fileUrl
  }

  /**
   * Valide le fichier avatar
   */
  validateAvatarFile(avatarFile: MultipartFile) {
    if (!avatarFile) {
      return {
        isValid: false,
        message: 'File is missing',
        errors: ['file_required'],
      }
    }

    if (!avatarFile.isValid) {
      return {
        isValid: false,
        message:
          'Fichier invalide. Veuillez fournir une image valide (jpg, jpeg, png, webp) de moins de 2MB.',
        errors: avatarFile.errors || [],
      }
    }

    return { isValid: true }
  }

  /**
   * Supprime l'ancien avatar
   */
  private async deleteOldAvatar(user: User): Promise<void> {
    if (!user.avatar) return

    try {
      const key = user.avatar.split(PUBLIC_BUCKET_URL + '/')[1]
      if (key) {
        await this.disk.delete(key)
      }
    } catch (error) {
      console.warn('Unable to delete old avatar')
    }
  }

  /**
   * Upload le nouveau fichier avatar
   */
  private async uploadAvatar(avatarFile: MultipartFile, user: User): Promise<string> {
    const fileName = `${randomUUID()}.${avatarFile.extname}`
    const key = `users/${user.id}/avatars/${fileName}`

    await avatarFile.moveToDisk(key)

    return `${PUBLIC_BUCKET_URL}/${key}`
  }
}

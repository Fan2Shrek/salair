import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import UserRepository from '#repositories/user.repository'
import ErrorService from '#services/error.service'
import { DateTime } from 'luxon'

export default class UsersAdminController {
  async index({ request, response }: HttpContext) {
    try {
      const filters = request.only([
        'email',
        'status',
        'created_after',
        'created_before',
        'page',
        'limit',
        'sort_by',
        'order',
      ])

      // Convert date strings to DateTime objects if provided
      if (filters.created_after) {
        filters.created_after = DateTime.fromISO(filters.created_after)
      }
      if (filters.created_before) {
        filters.created_before = DateTime.fromISO(filters.created_before)
      }

      // Set default pagination if not provided
      filters.page = Number.parseInt(filters.page) || 1
      filters.limit = Number.parseInt(filters.limit) || 10

      const users = await UserRepository.getFilteredUsers(filters)
      return response.ok(users)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch users')
    }
  }

  async show({ response, params }: HttpContext) {
    try {
      const user = await UserRepository.findByIdOrFail(params.id)
      await user.load('company')
      return response.ok(user)
    } catch (error) {
      return ErrorService.userNotFound(response)
    }
  }

  async suspend({ response, params }: HttpContext) {
    try {
      if (!params.id) {
        return ErrorService.missingRequiredField(response, 'id')
      }

      const user = await UserRepository.findByIdOrFail(params.id)
      const updatedUser = await UserRepository.update(user, { status: 'suspended' })

      return response.ok(updatedUser)
    } catch (error) {
      return ErrorService.userNotFound(response)
    }
  }

  async reactivate({ response, params }: HttpContext) {
    try {
      if (!params.id) {
        return ErrorService.missingRequiredField(response, 'id')
      }

      const user = await UserRepository.findByIdOrFail(params.id)
      const updatedUser = await UserRepository.update(user, { status: 'active' })

      return response.ok(updatedUser)
    } catch (error) {
      return ErrorService.userNotFound(response)
    }
  }

  /**
   * Crée un nouvel utilisateur
   */
  async store({ request, response }: HttpContext) {
    try {
      const userData = request.only(['firstName', 'lastName', 'email', 'password', 'phoneNumber'])

      // Check if email already exists
      if (await UserRepository.emailExists(userData.email)) {
        return ErrorService.emailAlreadyExists(response)
      }

      const user = await UserRepository.create(userData)
      return response.created(user)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to create user')
    }
  }

  /**
   * Met à jour un utilisateur existant
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const user = await UserRepository.findByIdOrFail(params.id)
      const userData = request.only(['firstName', 'lastName', 'email', 'phoneNumber', 'avatar'])

      // Check if email already exists for another user
      if (userData.email && userData.email !== user.email) {
        if (await UserRepository.emailExists(userData.email)) {
          return ErrorService.emailAlreadyExists(response)
        }
      }

      const updatedUser = await UserRepository.update(user, userData)
      return response.ok(updatedUser)
    } catch (error) {
      return ErrorService.userNotFound(response)
    }
  }

  /**
   * Met à jour spécifiquement l'avatar d'un utilisateur
   */
  async updateAvatar({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const avatarFile = request.file('file', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (!avatarFile || !avatarFile.isValid) {
        return ErrorService.invalidFileType(response, ['jpg', 'jpeg', 'png', 'webp'])
      }

      const filename = `${randomUUID()}.${avatarFile.extname}`
      const key = `users/${user.id}/logos/${filename}`

      await avatarFile.moveToDisk(key)

      const updatedUser = await UserRepository.update(user, { avatar: avatarFile.meta.url })
      return response.ok({ user: updatedUser, avatar_url: updatedUser.avatar })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to update avatar')
    }
  }

  /**
   * Supprime un utilisateur (soft delete)
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const user = await UserRepository.findByIdOrFail(params.id)
      await UserRepository.delete(user)

      return response.noContent()
    } catch (error) {
      return ErrorService.userNotFound(response)
    }
  }
}

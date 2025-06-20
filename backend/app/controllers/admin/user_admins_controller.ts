import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/user_service'
import { filterParamsSchema } from '#validators/admin/user'

export default class UserAdminsController {
  async index({ request }: HttpContext) {
    const filters = await request.validateUsing(filterParamsSchema)
    return await UserService.getFilteredUsers(filters)
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
}

import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create(data)

    return User.accessTokens.create(user)
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)

    // return response.cookie('access_token', `Bearer ${token.value}`)
    return {
      type: 'bearer',
      value: token.value!.release(),
    }
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user!

    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return { message: 'success' }
  }

  async me({ auth, response }: HttpContext) {
    if (!auth.user) {
      return response.status(401).send({ message: 'JWT not valid or missing' })
    }

    return {
      user: auth.user,
    }
  }
}

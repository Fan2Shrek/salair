import type { HttpContext } from '@adonisjs/core/http'

export default class InboudMailsController {
  async receive({ request, response }: HttpContext) {
    const data = request.all()

    console.log('📥 Mail received: ', data)

    return response.ok({ success: true })
  }
}

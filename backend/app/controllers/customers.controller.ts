import Customer from '#models/customer'
import { SireneService } from '#services/sirene.service'
import CustomerInsightsService from '#services/customer_insights.service'
import type { HttpContext } from '@adonisjs/core/http'

export default class CustomersController {
  async index({ request, response, auth }: HttpContext) {
    const user = auth.user!

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const customers = await Customer.query()
      .where('userId', user.id)
      .apply((scopes) => scopes.withoutTrashed())
      .paginate(page, limit)

    return response.ok(customers)
  }

  async destroy({ response, params, auth }: HttpContext) {
    const id = params.id
    const user = auth.user!

    const customer = await Customer.query().where('id', id).where('userId', user.id).first()

    if (!customer) {
      return response.notFound({ message: 'Customer not found' })
    }

    await customer.delete()

    return response.noContent()
  }

  async insights({ response, auth }: HttpContext) {
    const user = auth.user!
    const insights = await CustomerInsightsService.getInsights(user)
    return response.ok(insights)
  }

  async fetchCompany({ request, response }: HttpContext) {
    const siren = request.input('siren')

    try {
      const result = await SireneService.enrichCustomer(siren)
      return result
    } catch (error: any) {
      console.log(error)
      return response.notFound({ messages: 'Company not found' })
    }
  }
}

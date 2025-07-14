import Customer from '#models/customer'
import { SireneService } from '#services/sirene.service'
import CustomerInsightsService from '#services/customer_insights.service'
import ErrorService from '#services/error.service'
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
    try {
      const id = params.id
      const user = auth.user!

      const customer = await Customer.query().where('id', id).where('userId', user.id).first()

      if (!customer) {
        return ErrorService.notFound(response, 'Customer not found')
      }

      await customer.delete()
      return response.noContent()
    } catch (error) {
      return ErrorService.internal(response, error)
    }
  }

  async insights({ response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const insights = await CustomerInsightsService.getInsights(user)
      return response.ok(insights)
    } catch (error) {
      return ErrorService.internal(response, error)
    }
  }

  async fetchCompany({ request, response }: HttpContext) {
    try {
      const siren = request.input('siren')

      if (!siren) {
        return ErrorService.validation(response, 'SIREN is required')
      }

      const result = await SireneService.enrichCustomer(siren)
      return result
    } catch (error: any) {
      return ErrorService.externalService(response, error.message, 'SIRENE API')
    }
  }
}

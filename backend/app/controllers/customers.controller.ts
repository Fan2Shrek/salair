import Customer from '#models/customer'
import { SireneService } from '#services/sirene.service'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

const now = DateTime.now()

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
    const user = await auth.user!
    const startOfThisMonth = now.startOf('month')
    // const startOfLastMonth = startOfThisMonth.minus({ months: 1 })
    // const endOfLastMonth = startOfThisMonth.minus({ days: 1 })

    const totalCustomers = await Customer.query().where('userId', user.id)
    const customersThisMonth = await Customer.query()
      .where('userId', user.id)
      .whereBetween('createdAt', [startOfThisMonth.toSQL()!, now.toSQL()!])

    const customersBeforeThisMonth = totalCustomers.length - customersThisMonth.length
    const customersEvolution =
      totalCustomers.length === 0 || customersBeforeThisMonth === 0
        ? 0
        : (customersThisMonth.length / customersBeforeThisMonth) * 100

    return response.ok({
      data: [
        {
          label: 'Total customers',
          value: totalCustomers.length,
          percentage: customersEvolution,
        },
        {
          label: 'Clients facturés',
          value: 4,
          percentage: -10,
        },
        {
          label: 'Clients avec impayés',
          value: 10,
          percentage: 24,
        },
      ],
    })
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

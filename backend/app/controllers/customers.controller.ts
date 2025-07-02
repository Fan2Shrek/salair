import Customer from '#models/customer'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

const now = DateTime.now()

export default class CustomersController {
  async index({ request, response, auth }: HttpContext) {
    const user = auth.user!

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const customers = await Customer.query().where('userId', user.id).paginate(page, limit)

    return response.ok(customers)
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
    const evolution =
      totalCustomers.length === 0 || customersBeforeThisMonth === 0
        ? 0
        : (customersThisMonth.length / customersBeforeThisMonth) * 100

    return response.ok({
      data: [
        {
          label: 'Total customers',
          value: totalCustomers.length,
          percentage: evolution,
        },
      ],
    })
  }
}

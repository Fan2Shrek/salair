import CustomerRepository from '#repositories/customer.repository'
import { SireneService } from '#services/sirene.service'
import CustomerInsightsService from '#services/customer_insights.service'
import ErrorService from '#services/error.service'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class CustomersController {
  async index({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const filters = request.only([
        'companyName',
        'contactName',
        'email',
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

      const customers = await CustomerRepository.getFilteredCustomers(user.id, filters)
      return response.ok(customers)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch customers')
    }
  }

  async destroy({ response, params, auth }: HttpContext) {
    try {
      const user = auth.user!

      if (!params.id) {
        return ErrorService.missingRequiredField(response, 'id')
      }

      const customer = await CustomerRepository.findByIdForUser(params.id, user.id)

      if (!customer) {
        return ErrorService.customerNotFound(response)
      }

      await CustomerRepository.delete(customer)
      return response.noContent()
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to delete customer')
    }
  }

  async show({ response, params, auth }: HttpContext) {
    try {
      const user = auth.user!

      if (!params.id) {
        return ErrorService.missingRequiredField(response, 'id')
      }

      const customer = await CustomerRepository.findByIdForUser(params.id, user.id)

      if (!customer) {
        return ErrorService.customerNotFound(response)
      }

      return response.ok(customer)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch customer')
    }
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const customerData = request.only([
        'companyName',
        'contactName',
        'email',
        'phoneNumber',
        'address',
      ])

      // Check if email already exists for this user
      if (await CustomerRepository.emailExistsForUser(customerData.email, user.id)) {
        return ErrorService.conflict(response, 'Customer with this email already exists')
      }

      const customer = await CustomerRepository.create({
        ...customerData,
        userId: user.id,
      })

      return response.created(customer)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to create customer')
    }
  }

  async update({ request, response, params, auth }: HttpContext) {
    try {
      const user = auth.user!

      if (!params.id) {
        return ErrorService.missingRequiredField(response, 'id')
      }

      const customer = await CustomerRepository.findByIdForUser(params.id, user.id)

      if (!customer) {
        return ErrorService.customerNotFound(response)
      }

      const customerData = request.only([
        'companyName',
        'contactName',
        'email',
        'phoneNumber',
        'address',
      ])

      // Check if email already exists for another customer of this user
      if (customerData.email && customerData.email !== customer.email) {
        if (
          await CustomerRepository.emailExistsForUserExcluding(
            customerData.email,
            user.id,
            customer.id
          )
        ) {
          return ErrorService.conflict(response, 'Customer with this email already exists')
        }
      }

      const updatedCustomer = await CustomerRepository.update(customer, customerData)
      return response.ok(updatedCustomer)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to update customer')
    }
  }

  async search({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const searchTerm = request.input('q')
      const page = Number.parseInt(request.input('page', 1))
      const limit = Number.parseInt(request.input('limit', 10))

      if (!searchTerm) {
        return ErrorService.missingRequiredField(response, 'q')
      }

      const customers = await CustomerRepository.searchForUser(user.id, searchTerm, page, limit)
      return response.ok(customers)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to search customers')
    }
  }

  async statistics({ response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const statistics = await CustomerRepository.getStatisticsForUser(user.id)
      return response.ok(statistics)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch customer statistics')
    }
  }

  async insights({ response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const insights = await CustomerInsightsService.getInsights(user)
      return response.ok(insights)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch customer insights')
    }
  }

  async fetchCompany({ request, response }: HttpContext) {
    try {
      const siren = request.input('siren')

      if (!siren) {
        return ErrorService.missingRequiredField(response, 'SIREN')
      }

      const result = await SireneService.enrichCustomer(siren)
      return result
    } catch (error: any) {
      return ErrorService.sireneApiError(response, error.message)
    }
  }
}

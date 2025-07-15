import CustomerRepository from '#repositories/customer.repository'
import { SireneService } from '#services/sirene.service'
import CustomerInsightsService from '#services/customer_insights.service'
import ErrorService from '#services/error.service'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import {
  createCustomerValidator,
  updateCustomerValidator,
  customerFilterValidator,
  customerEnrichValidator,
} from '#validators/customer'

export default class CustomersController {
  async index({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const payload = await request.validateUsing(customerFilterValidator)
      const { page = 1, limit = 10, ...filters } = payload

      const processedFilters = {
        ...filters,
        createdAfter: filters.createdAfter ? DateTime.fromJSDate(filters.createdAfter) : undefined,
        createdBefore: filters.createdBefore
          ? DateTime.fromJSDate(filters.createdBefore)
          : undefined,
        page,
        limit,
      }

      const customers = await CustomerRepository.getFilteredCustomers(user.id, processedFilters)
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
      const payload = await request.validateUsing(createCustomerValidator)

      // Check if email already exists for this user
      if (await CustomerRepository.emailExistsForUser(payload.email, user.id)) {
        return ErrorService.conflict(response, 'Customer with this email already exists')
      }

      const customer = await CustomerRepository.create({
        ...payload,
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

      const payload = await request.validateUsing(updateCustomerValidator)

      // Check if email already exists for another customer of this user
      if (payload.email && payload.email !== customer.email) {
        if (
          await CustomerRepository.emailExistsForUserExcluding(payload.email, user.id, customer.id)
        ) {
          return ErrorService.conflict(response, 'Customer with this email already exists')
        }
      }

      const updatedCustomer = await CustomerRepository.update(customer, payload)
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
      const payload = await request.validateUsing(customerEnrichValidator)
      const result = await SireneService.enrichCustomer(payload.siret)
      return result
    } catch (error: any) {
      return ErrorService.sireneApiError(response, error.message)
    }
  }
}

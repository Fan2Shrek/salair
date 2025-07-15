import type { HttpContext } from '@adonisjs/core/http'
import PaymentRepository from '#repositories/payment.repository'
import type { PaymentFilters } from '#repositories/payment.repository'
import ErrorService from '#services/error.service'
import { DateTime } from 'luxon'
import {
  createPaymentValidator,
  updatePaymentValidator,
  paymentFilterValidator,
} from '#validators/payment'

export default class PaymentsController {
  /**
   * Get paginated payments for the authenticated user
   */
  async index({ auth, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const payload = await request.validateUsing(paymentFilterValidator)
      const { page = 1, limit = 20, ...filters } = payload

      const processedFilters: PaymentFilters = {
        ...filters,
        startDate: filters.startDate ? DateTime.fromJSDate(filters.startDate) : undefined,
        endDate: filters.endDate ? DateTime.fromJSDate(filters.endDate) : undefined,
      }

      const payments = await PaymentRepository.getPaginatedForUser(
        user.id,
        page,
        limit,
        processedFilters
      )

      return response.json({
        success: true,
        data: payments,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch payments')
    }
  }

  /**
   * Get a specific payment by ID
   */
  async show({ auth, params, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const payment = await PaymentRepository.findByIdForUser(params.id, user.id)

      if (!payment) {
        return ErrorService.notFound(response, 'Payment not found')
      }

      return response.json({
        success: true,
        data: payment,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch payment')
    }
  }

  /**
   * Create a new payment
   */
  async store({ auth, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const payload = await request.validateUsing(createPaymentValidator)

      const payment = await PaymentRepository.create({
        ...payload,
        userId: user.id,
        receivedAt: payload.receivedAt ? DateTime.fromJSDate(payload.receivedAt) : null,
      })

      return response.status(201).json({
        success: true,
        data: payment,
        message: 'Payment created successfully',
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to create payment')
    }
  }

  /**
   * Update an existing payment
   */
  async update({ auth, params, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const payload = await request.validateUsing(updatePaymentValidator)

      const updateData = {
        ...payload,
        receivedAt: payload.receivedAt ? DateTime.fromJSDate(payload.receivedAt) : undefined,
      }

      const payment = await PaymentRepository.update(params.id, user.id, updateData)

      return response.json({
        success: true,
        data: payment,
        message: 'Payment updated successfully',
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to update payment')
    }
  }

  /**
   * Delete a payment
   */
  async destroy({ auth, params, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      await PaymentRepository.delete(params.id, user.id)

      return response.json({
        success: true,
        message: 'Payment deleted successfully',
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to delete payment')
    }
  }

  /**
   * Get payment statistics for the authenticated user
   */
  async statistics({ auth, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const filters: PaymentFilters = {
        startDate: request.input('startDate')
          ? DateTime.fromISO(request.input('startDate'))
          : undefined,
        endDate: request.input('endDate') ? DateTime.fromISO(request.input('endDate')) : undefined,
      }

      const stats = await PaymentRepository.getStatsForUser(user.id, filters)

      return response.json({
        success: true,
        data: stats,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch payment statistics')
    }
  }

  /**
   * Get recent payments for the authenticated user
   */
  async recent({ auth, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const limit = request.input('limit', 10)
      const payments = await PaymentRepository.getRecentForUser(user.id, limit)

      return response.json({
        success: true,
        data: payments,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch recent payments')
    }
  }

  /**
   * Get payments for a specific invoice
   */
  async byInvoice({ auth, params, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const payments = await PaymentRepository.getByInvoiceForUser(params.invoiceId, user.id)

      return response.json({
        success: true,
        data: payments,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch invoice payments')
    }
  }

  /**
   * Get total payment amount for an invoice
   */
  async totalForInvoice({ auth, params, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const total = await PaymentRepository.getTotalForInvoice(params.invoiceId, user.id)

      return response.json({
        success: true,
        data: { total },
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch payment total')
    }
  }

  /**
   * Get payment methods used by the authenticated user
   */
  async methods({ auth, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const methods = await PaymentRepository.getMethodsForUser(user.id)

      return response.json({
        success: true,
        data: methods,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch payment methods')
    }
  }

  /**
   * Get payments by date range
   */
  async byDateRange({ auth, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const payload = await request.validateUsing(paymentFilterValidator)

      if (!payload.startDate || !payload.endDate) {
        return ErrorService.validation(response, 'Start date and end date are required')
      }

      const payments = await PaymentRepository.getByDateRangeForUser(
        user.id,
        DateTime.fromJSDate(payload.startDate),
        DateTime.fromJSDate(payload.endDate)
      )

      return response.json({
        success: true,
        data: payments,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch payments by date range')
    }
  }

  /**
   * Export payments data
   */
  async export({ auth, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const payload = await request.validateUsing(paymentFilterValidator)

      const filters: PaymentFilters = {
        ...payload,
        startDate: payload.startDate ? DateTime.fromJSDate(payload.startDate) : undefined,
        endDate: payload.endDate ? DateTime.fromJSDate(payload.endDate) : undefined,
      }

      const payments = await PaymentRepository.getForExport(user.id, filters)

      return response.json({
        success: true,
        data: payments,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to export payments')
    }
  }

  /**
   * Check if payment exists for an invoice
   */
  async checkForInvoice({ auth, params, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const exists = await PaymentRepository.paymentExistsForInvoice(params.invoiceId, user.id)

      return response.json({
        success: true,
        data: { exists },
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to check payment existence')
    }
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import InvoiceRepository from '#repositories/invoice.repository'
import type { InvoiceFilters } from '#repositories/invoice.repository'
import ErrorService from '#services/error.service'
import { DateTime } from 'luxon'
import {
  createInvoiceValidator,
  updateInvoiceValidator,
  invoiceStatusValidator,
  invoiceFilterValidator,
} from '#validators/invoice'

export default class InvoicesController {
  /**
   * Get paginated invoices for the authenticated user
   */
  async index({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!

      const payload = await request.validateUsing(invoiceFilterValidator)
      const { page = 1, limit = 20, ...filters } = payload

      const processedFilters: InvoiceFilters = {
        ...filters,
        startDate: filters.startDate ? DateTime.fromJSDate(filters.startDate) : undefined,
        endDate: filters.endDate ? DateTime.fromJSDate(filters.endDate) : undefined,
      }

      const invoices = await InvoiceRepository.getPaginatedForUser(
        user.id,
        page,
        limit,
        processedFilters
      )

      return response.json(invoices)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch invoices')
    }
  }

  /**
   * Get a specific invoice by ID
   */
  async show({ auth, params, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const invoice = await InvoiceRepository.findByIdForUser(params.id, user.id)

      if (!invoice) {
        return ErrorService.notFound(response, 'Invoice not found')
      }

      return response.json({
        success: true,
        data: invoice,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch invoice')
    }
  }

  /**
   * Create a new invoice
   */
  async store({ auth, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const payload = await request.validateUsing(createInvoiceValidator)

      // Generate invoice number if not provided
      if (!payload.invoiceNumber) {
        payload.invoiceNumber = await InvoiceRepository.generateNextInvoiceNumber(user.id)
      }

      // Check if invoice number already exists
      const existingInvoice = await InvoiceRepository.invoiceNumberExistsForUser(
        payload.invoiceNumber,
        user.id
      )
      if (existingInvoice) {
        return ErrorService.validation(response, 'Invoice number already exists')
      }

      // Calculate totals from items
      let totalHT = 0
      let totalTTC = 0

      for (const item of payload.items) {
        const itemTotal = item.quantity * item.unitPrice
        const vatRate = item.vatRate || 0
        const vatAmount = (itemTotal * vatRate) / 100

        totalHT += itemTotal
        totalTTC += itemTotal + vatAmount
      }

      const invoice = await InvoiceRepository.create({
        userId: user.id,
        customerId: payload.customerId,
        invoiceNumber: payload.invoiceNumber,
        issueDate: DateTime.fromJSDate(payload.issueDate),
        dueDate: DateTime.fromJSDate(payload.dueDate),
        status: 'draft',
        totalHT,
        totalTTC,
        notes: payload.notes || '',
        pdfUrl: '',
      })

      return response.status(201).json({
        success: true,
        data: invoice,
        message: 'Invoice created successfully',
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to create invoice')
    }
  }

  /**
   * Update an existing invoice
   */
  async update({ auth, params, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const payload = await request.validateUsing(updateInvoiceValidator)

      // Check if invoice number already exists (excluding current invoice)
      if (payload.invoiceNumber) {
        const existingInvoice = await InvoiceRepository.invoiceNumberExistsForUser(
          payload.invoiceNumber,
          user.id,
          params.id
        )
        if (existingInvoice) {
          return ErrorService.validation(response, 'Invoice number already exists')
        }
      }

      // Process the data
      const updateData: any = {}

      if (payload.customerId) updateData.customerId = payload.customerId
      if (payload.invoiceNumber) updateData.invoiceNumber = payload.invoiceNumber
      if (payload.issueDate) updateData.issueDate = DateTime.fromJSDate(payload.issueDate)
      if (payload.dueDate) updateData.dueDate = DateTime.fromJSDate(payload.dueDate)
      if (payload.status) updateData.status = payload.status
      if (payload.notes !== undefined) updateData.notes = payload.notes

      // Recalculate totals if items are provided
      if (payload.items) {
        let totalHT = 0
        let totalTTC = 0

        for (const item of payload.items) {
          const itemTotal = item.quantity * item.unitPrice
          const vatRate = item.vatRate || 0
          const vatAmount = (itemTotal * vatRate) / 100

          totalHT += itemTotal
          totalTTC += itemTotal + vatAmount
        }

        updateData.totalHT = totalHT
        updateData.totalTTC = totalTTC
      }

      const invoice = await InvoiceRepository.update(params.id, user.id, updateData)

      return response.json({
        success: true,
        data: invoice,
        message: 'Invoice updated successfully',
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to update invoice')
    }
  }

  /**
   * Delete an invoice (soft delete)
   */
  async destroy({ auth, params, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      await InvoiceRepository.delete(params.id, user.id)

      return response.json({
        success: true,
        message: 'Invoice deleted successfully',
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to delete invoice')
    }
  }

  /**
   * Update invoice status
   */
  async updateStatus({ auth, params, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const payload = await request.validateUsing(invoiceStatusValidator)

      const invoice = await InvoiceRepository.updateStatus(params.id, user.id, payload.status)

      return response.json({
        success: true,
        data: invoice,
        message: 'Invoice status updated successfully',
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to update invoice status')
    }
  }

  /**
   * Get invoice statistics for the authenticated user
   */
  async statistics({ auth, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const filters: InvoiceFilters = {
        startDate: request.input('startDate')
          ? DateTime.fromISO(request.input('startDate'))
          : undefined,
        endDate: request.input('endDate') ? DateTime.fromISO(request.input('endDate')) : undefined,
      }

      const stats = await InvoiceRepository.getStatsForUser(user.id, filters)

      return response.json({
        success: true,
        data: stats,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch invoice statistics')
    }
  }

  /**
   * Get overdue invoices for the authenticated user
   */
  async overdue({ auth, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const invoices = await InvoiceRepository.getOverdueForUser(user.id)

      return response.json({
        success: true,
        data: invoices,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch overdue invoices')
    }
  }

  /**
   * Get recent invoices for the authenticated user
   */
  async recent({ auth, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const limit = request.input('limit', 10)
      const invoices = await InvoiceRepository.getRecentForUser(user.id, limit)

      return response.json({
        success: true,
        data: invoices,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch recent invoices')
    }
  }

  /**
   * Get invoices for a specific customer
   */
  async byCustomer({ auth, params, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const invoices = await InvoiceRepository.getByCustomerForUser(params.customerId, user.id)

      return response.json({
        success: true,
        data: invoices,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch customer invoices')
    }
  }

  /**
   * Export invoices data
   */
  async export({ auth, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const user = auth.user!

      const filters: InvoiceFilters = {
        status: request.input('status'),
        customerId: request.input('customerId'),
        search: request.input('search'),
        startDate: request.input('startDate')
          ? DateTime.fromISO(request.input('startDate'))
          : undefined,
        endDate: request.input('endDate') ? DateTime.fromISO(request.input('endDate')) : undefined,
      }

      const invoices = await InvoiceRepository.getAllForUser(user.id, filters)

      return response.json({
        success: true,
        data: invoices,
      })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to export invoices')
    }
  }
}

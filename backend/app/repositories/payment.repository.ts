import type { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import Payment from '#models/payment'
import type { DateTime } from 'luxon'
import { Exception } from '@adonisjs/core/exceptions'

export interface PaymentFilters {
  invoiceId?: string
  method?: string
  search?: string
  startDate?: DateTime
  endDate?: DateTime
  minAmount?: number
  maxAmount?: number
}

export interface PaymentCreateData {
  invoiceId: string
  userId: string
  amount: number
  method: 'stripe' | 'bank_transfer' | 'cash' | 'check'
  receivedAt: DateTime | null
}

export interface PaymentUpdateData {
  amount?: number
  method?: 'stripe' | 'bank_transfer' | 'cash' | 'check'
  receivedAt?: DateTime | null
}

export interface PaymentStats {
  totalPayments: number
  totalAmount: number
  averageAmount: number
  byMethod: Record<string, { count: number; amount: number }>
  monthlyTrend: Array<{
    month: string
    count: number
    amount: number
  }>
}

export class PaymentRepository {
  /**
   * Get paginated payments for a user with optional filters
   */
  static async getPaginatedForUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
    filters: PaymentFilters = {}
  ): Promise<ModelPaginatorContract<Payment>> {
    const query = Payment.query()
      .where('userId', userId)
      .preload('invoice', (invoiceQuery) => {
        invoiceQuery.preload('customer')
      })
      .orderBy('receivedAt', 'desc')

    // Apply filters
    if (filters.invoiceId) {
      query.where('invoiceId', filters.invoiceId)
    }

    if (filters.method) {
      query.where('method', filters.method)
    }

    if (filters.search) {
      query.where((builder) => {
        builder
          .where('method', 'ilike', `%${filters.search}%`)
          .orWhereHas('invoice', (invoiceQuery) => {
            invoiceQuery
              .where('invoiceNumber', 'ilike', `%${filters.search}%`)
              .orWhereHas('customer', (customerQuery) => {
                customerQuery.where('name', 'ilike', `%${filters.search}%`)
              })
          })
      })
    }

    if (filters.startDate) {
      query.where('receivedAt', '>=', filters.startDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    if (filters.endDate) {
      query.where('receivedAt', '<=', filters.endDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    if (filters.minAmount) {
      query.where('amount', '>=', filters.minAmount)
    }

    if (filters.maxAmount) {
      query.where('amount', '<=', filters.maxAmount)
    }

    return query.paginate(page, limit)
  }

  /**
   * Get all payments for a user (without pagination)
   */
  static async getAllForUser(userId: string, filters: PaymentFilters = {}): Promise<Payment[]> {
    const query = Payment.query()
      .where('userId', userId)
      .preload('invoice', (invoiceQuery) => {
        invoiceQuery.preload('customer')
      })
      .orderBy('receivedAt', 'desc')

    // Apply same filters as paginated version
    if (filters.invoiceId) {
      query.where('invoiceId', filters.invoiceId)
    }

    if (filters.method) {
      query.where('method', filters.method)
    }

    if (filters.search) {
      query.where((builder) => {
        builder
          .where('method', 'ilike', `%${filters.search}%`)
          .orWhereHas('invoice', (invoiceQuery) => {
            invoiceQuery
              .where('invoiceNumber', 'ilike', `%${filters.search}%`)
              .orWhereHas('customer', (customerQuery) => {
                customerQuery.where('name', 'ilike', `%${filters.search}%`)
              })
          })
      })
    }

    if (filters.startDate) {
      query.where('receivedAt', '>=', filters.startDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    if (filters.endDate) {
      query.where('receivedAt', '<=', filters.endDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    if (filters.minAmount) {
      query.where('amount', '>=', filters.minAmount)
    }

    if (filters.maxAmount) {
      query.where('amount', '<=', filters.maxAmount)
    }

    return query.exec()
  }

  /**
   * Find payment by ID for a specific user
   */
  static async findByIdForUser(id: string, userId: string): Promise<Payment | null> {
    return Payment.query()
      .where('id', id)
      .where('userId', userId)
      .preload('invoice', (invoiceQuery) => {
        invoiceQuery.preload('customer')
      })
      .first()
  }

  /**
   * Get payments for a specific invoice
   */
  static async getByInvoiceForUser(invoiceId: string, userId: string): Promise<Payment[]> {
    return Payment.query()
      .where('invoiceId', invoiceId)
      .where('userId', userId)
      .preload('invoice', (invoiceQuery) => {
        invoiceQuery.preload('customer')
      })
      .orderBy('receivedAt', 'desc')
      .exec()
  }

  /**
   * Create a new payment
   */
  static async create(data: PaymentCreateData): Promise<Payment> {
    const payment = new Payment()
    payment.invoiceId = data.invoiceId
    payment.userId = data.userId
    payment.amount = data.amount
    payment.method = data.method
    payment.receivedAt = data.receivedAt

    await payment.save()
    await payment.load('invoice', (invoiceQuery) => {
      invoiceQuery.preload('customer')
    })

    return payment
  }

  /**
   * Update an existing payment
   */
  static async update(id: string, userId: string, data: PaymentUpdateData): Promise<Payment> {
    const payment = await this.findByIdForUser(id, userId)
    if (!payment) {
      throw new Exception('Payment not found', { status: 404 })
    }

    if (data.amount !== undefined) payment.amount = data.amount
    if (data.method !== undefined) payment.method = data.method
    if (data.receivedAt !== undefined) payment.receivedAt = data.receivedAt

    await payment.save()
    await payment.load('invoice', (invoiceQuery) => {
      invoiceQuery.preload('customer')
    })

    return payment
  }

  /**
   * Delete a payment
   */
  static async delete(id: string, userId: string): Promise<boolean> {
    const payment = await this.findByIdForUser(id, userId)
    if (!payment) {
      throw new Exception('Payment not found', { status: 404 })
    }

    await payment.delete()
    return true
  }

  /**
   * Get payment statistics for a user
   */
  static async getStatsForUser(
    userId: string,
    filters: PaymentFilters = {}
  ): Promise<PaymentStats> {
    const query = Payment.query().where('userId', userId)

    // Apply date filters if provided
    if (filters.startDate) {
      query.where('receivedAt', '>=', filters.startDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    if (filters.endDate) {
      query.where('receivedAt', '<=', filters.endDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    const payments = await query.exec()

    const stats: PaymentStats = {
      totalPayments: payments.length,
      totalAmount: 0,
      averageAmount: 0,
      byMethod: {},
      monthlyTrend: [],
    }

    // Calculate totals and by method stats
    for (const payment of payments) {
      stats.totalAmount += payment.amount

      if (!stats.byMethod[payment.method]) {
        stats.byMethod[payment.method] = { count: 0, amount: 0 }
      }
      stats.byMethod[payment.method].count++
      stats.byMethod[payment.method].amount += payment.amount
    }

    stats.averageAmount = stats.totalPayments > 0 ? stats.totalAmount / stats.totalPayments : 0

    // Calculate monthly trend (last 12 months)
    const monthlyData: Record<string, { count: number; amount: number }> = {}

    for (const payment of payments) {
      if (payment.receivedAt) {
        const monthKey = payment.receivedAt.toFormat('yyyy-MM')
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { count: 0, amount: 0 }
        }
        monthlyData[monthKey].count++
        monthlyData[monthKey].amount += payment.amount
      }
    }

    // Convert to array and sort by month
    stats.monthlyTrend = Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))

    return stats
  }

  /**
   * Get recent payments for a user
   */
  static async getRecentForUser(userId: string, limit: number = 10): Promise<Payment[]> {
    return Payment.query()
      .where('userId', userId)
      .preload('invoice', (invoiceQuery) => {
        invoiceQuery.preload('customer')
      })
      .orderBy('receivedAt', 'desc')
      .limit(limit)
      .exec()
  }

  /**
   * Get total payment amount for an invoice
   */
  static async getTotalForInvoice(invoiceId: string, userId: string): Promise<number> {
    const result = await Payment.query()
      .where('invoiceId', invoiceId)
      .where('userId', userId)
      .sum('amount as total')
      .first()

    return result?.$extras.total || 0
  }

  /**
   * Get payment methods used by a user
   */
  static async getMethodsForUser(userId: string): Promise<string[]> {
    const payments = await Payment.query()
      .where('userId', userId)
      .select('method')
      .groupBy('method')
      .exec()

    return payments.map((payment) => payment.method)
  }

  /**
   * Get payments by date range for a user
   */
  static async getByDateRangeForUser(
    userId: string,
    startDate: DateTime,
    endDate: DateTime
  ): Promise<Payment[]> {
    return Payment.query()
      .where('userId', userId)
      .where('receivedAt', '>=', startDate.toFormat('yyyy-MM-dd HH:mm:ss'))
      .where('receivedAt', '<=', endDate.toFormat('yyyy-MM-dd HH:mm:ss'))
      .preload('invoice', (invoiceQuery) => {
        invoiceQuery.preload('customer')
      })
      .orderBy('receivedAt', 'desc')
      .exec()
  }

  /**
   * Get payments for export (CSV/Excel)
   */
  static async getForExport(userId: string, filters: PaymentFilters = {}): Promise<Payment[]> {
    const query = Payment.query()
      .where('userId', userId)
      .preload('invoice', (invoiceQuery) => {
        invoiceQuery.preload('customer')
      })
      .orderBy('receivedAt', 'desc')

    // Apply filters
    if (filters.invoiceId) {
      query.where('invoiceId', filters.invoiceId)
    }

    if (filters.method) {
      query.where('method', filters.method)
    }

    if (filters.startDate) {
      query.where('receivedAt', '>=', filters.startDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    if (filters.endDate) {
      query.where('receivedAt', '<=', filters.endDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    if (filters.minAmount) {
      query.where('amount', '>=', filters.minAmount)
    }

    if (filters.maxAmount) {
      query.where('amount', '<=', filters.maxAmount)
    }

    return query.exec()
  }

  /**
   * Check if payment exists for invoice
   */
  static async paymentExistsForInvoice(invoiceId: string, userId: string): Promise<boolean> {
    const payment = await Payment.query()
      .where('invoiceId', invoiceId)
      .where('userId', userId)
      .first()

    return !!payment
  }
}

export default PaymentRepository

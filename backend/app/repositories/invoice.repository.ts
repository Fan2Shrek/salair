import type { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import Invoice from '#models/invoice'
import type { DateTime } from 'luxon'
import { Exception } from '@adonisjs/core/exceptions'

export interface InvoiceFilters {
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  customerId?: string
  search?: string
  startDate?: DateTime
  endDate?: DateTime
}

export interface InvoiceCreateData {
  userId: string
  customerId: string
  invoiceNumber: string
  issueDate: DateTime
  dueDate: DateTime
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  totalHT: number
  totalTTC: number
  notes?: string
  pdfUrl?: string
}

export interface InvoiceUpdateData {
  customerId?: string
  invoiceNumber?: string
  issueDate?: DateTime
  dueDate?: DateTime
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  totalHT?: number
  totalTTC?: number
  notes?: string
  pdfUrl?: string
}

export interface InvoiceStats {
  totalInvoices: number
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  overdueAmount: number
  averageAmount: number
  byStatus: {
    draft: number
    sent: number
    paid: number
    overdue: number
    cancelled: number
  }
}

export class InvoiceRepository {
  /**
   * Get paginated invoices for a user with optional filters
   */
  static async getPaginatedForUser(
    userId: string,
    page: number = 1,
    limit: number = 20,
    filters: InvoiceFilters = {}
  ): Promise<ModelPaginatorContract<Invoice>> {
    const query = Invoice.query()
      .where('userId', userId)
      .preload('customer')
      .preload('invoiceItems')
      .orderBy('createdAt', 'desc')

    // Apply filters
    if (filters.status) {
      query.where('status', filters.status)
    }

    if (filters.customerId) {
      query.where('customerId', filters.customerId)
    }

    if (filters.search) {
      query.where((builder) => {
        builder
          .where('invoiceNumber', 'ilike', `%${filters.search}%`)
          .orWhere('notes', 'ilike', `%${filters.search}%`)
          .orWhereHas('customer', (customerQuery) => {
            customerQuery
              .where('name', 'ilike', `%${filters.search}%`)
              .orWhere('email', 'ilike', `%${filters.search}%`)
          })
      })
    }

    if (filters.startDate) {
      query.where('issueDate', '>=', filters.startDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    if (filters.endDate) {
      query.where('issueDate', '<=', filters.endDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    return query.paginate(page, limit)
  }

  /**
   * Get all invoices for a user (without pagination)
   */
  static async getAllForUser(userId: string, filters: InvoiceFilters = {}): Promise<Invoice[]> {
    const query = Invoice.query()
      .where('userId', userId)
      .preload('customer')
      .preload('invoiceItems')
      .orderBy('createdAt', 'desc')

    // Apply same filters as paginated version
    if (filters.status) {
      query.where('status', filters.status)
    }

    if (filters.customerId) {
      query.where('customerId', filters.customerId)
    }

    if (filters.search) {
      query.where((builder) => {
        builder
          .where('invoiceNumber', 'ilike', `%${filters.search}%`)
          .orWhere('notes', 'ilike', `%${filters.search}%`)
          .orWhereHas('customer', (customerQuery) => {
            customerQuery
              .where('name', 'ilike', `%${filters.search}%`)
              .orWhere('email', 'ilike', `%${filters.search}%`)
          })
      })
    }

    if (filters.startDate) {
      query.where('issueDate', '>=', filters.startDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    if (filters.endDate) {
      query.where('issueDate', '<=', filters.endDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    return query.exec()
  }

  /**
   * Find invoice by ID for a specific user
   */
  static async findByIdForUser(id: string, userId: string): Promise<Invoice | null> {
    return Invoice.query()
      .where('id', id)
      .where('userId', userId)
      .preload('customer')
      .preload('invoiceItems')
      .first()
  }

  /**
   * Find invoice by invoice number for a specific user
   */
  static async findByNumberForUser(invoiceNumber: string, userId: string): Promise<Invoice | null> {
    return Invoice.query()
      .where('invoiceNumber', invoiceNumber)
      .where('userId', userId)
      .preload('customer')
      .preload('invoiceItems')
      .first()
  }

  /**
   * Create a new invoice
   */
  static async create(data: InvoiceCreateData): Promise<Invoice> {
    const invoice = new Invoice()
    invoice.userId = data.userId
    invoice.customerId = data.customerId
    invoice.invoiceNumber = data.invoiceNumber
    invoice.issueDate = data.issueDate
    invoice.dueDate = data.dueDate
    invoice.status = data.status || 'draft'
    invoice.totalHT = data.totalHT
    invoice.totalTTC = data.totalTTC
    invoice.notes = data.notes || ''
    invoice.pdfUrl = data.pdfUrl || ''

    await invoice.save()
    await invoice.load('customer')
    await invoice.load('invoiceItems')

    return invoice
  }

  /**
   * Update an existing invoice
   */
  static async update(id: string, userId: string, data: InvoiceUpdateData): Promise<Invoice> {
    const invoice = await this.findByIdForUser(id, userId)
    if (!invoice) {
      throw new Exception('Invoice not found', { status: 404 })
    }

    if (data.customerId !== undefined) invoice.customerId = data.customerId
    if (data.invoiceNumber !== undefined) invoice.invoiceNumber = data.invoiceNumber
    if (data.issueDate !== undefined) invoice.issueDate = data.issueDate
    if (data.dueDate !== undefined) invoice.dueDate = data.dueDate
    if (data.status !== undefined) invoice.status = data.status
    if (data.totalHT !== undefined) invoice.totalHT = data.totalHT
    if (data.totalTTC !== undefined) invoice.totalTTC = data.totalTTC
    if (data.notes !== undefined) invoice.notes = data.notes
    if (data.pdfUrl !== undefined) invoice.pdfUrl = data.pdfUrl

    await invoice.save()
    await invoice.load('customer')
    await invoice.load('invoiceItems')

    return invoice
  }

  /**
   * Soft delete an invoice
   */
  static async delete(id: string, userId: string): Promise<boolean> {
    const invoice = await this.findByIdForUser(id, userId)
    if (!invoice) {
      throw new Exception('Invoice not found', { status: 404 })
    }

    await invoice.delete()
    return true
  }

  /**
   * Update invoice status
   */
  static async updateStatus(
    id: string,
    userId: string,
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  ): Promise<Invoice> {
    const invoice = await this.findByIdForUser(id, userId)
    if (!invoice) {
      throw new Exception('Invoice not found', { status: 404 })
    }

    invoice.status = status
    await invoice.save()
    await invoice.load('customer')
    await invoice.load('invoiceItems')

    return invoice
  }

  /**
   * Get invoice statistics for a user
   */
  static async getStatsForUser(
    userId: string,
    filters: InvoiceFilters = {}
  ): Promise<InvoiceStats> {
    const query = Invoice.query().where('userId', userId)

    // Apply date filters if provided
    if (filters.startDate) {
      query.where('issueDate', '>=', filters.startDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    if (filters.endDate) {
      query.where('issueDate', '<=', filters.endDate.toFormat('yyyy-MM-dd HH:mm:ss'))
    }

    const invoices = await query.exec()

    const stats: InvoiceStats = {
      totalInvoices: invoices.length,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      averageAmount: 0,
      byStatus: {
        draft: 0,
        sent: 0,
        paid: 0,
        overdue: 0,
        cancelled: 0,
      },
    }

    for (const invoice of invoices) {
      stats.totalAmount += invoice.totalTTC
      stats.byStatus[invoice.status]++

      switch (invoice.status) {
        case 'paid':
          stats.paidAmount += invoice.totalTTC
          break
        case 'overdue':
          stats.overdueAmount += invoice.totalTTC
          stats.pendingAmount += invoice.totalTTC
          break
        case 'sent':
          stats.pendingAmount += invoice.totalTTC
          break
      }
    }

    stats.averageAmount = stats.totalInvoices > 0 ? stats.totalAmount / stats.totalInvoices : 0

    return stats
  }

  /**
   * Get overdue invoices for a user
   */
  static async getOverdueForUser(userId: string): Promise<Invoice[]> {
    return Invoice.query()
      .where('userId', userId)
      .where('status', 'overdue')
      .preload('customer')
      .preload('invoiceItems')
      .orderBy('dueDate', 'asc')
      .exec()
  }

  /**
   * Get recent invoices for a user
   */
  static async getRecentForUser(userId: string, limit: number = 10): Promise<Invoice[]> {
    return Invoice.query()
      .where('userId', userId)
      .preload('customer')
      .preload('invoiceItems')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .exec()
  }

  /**
   * Get invoices by customer for a user
   */
  static async getByCustomerForUser(customerId: string, userId: string): Promise<Invoice[]> {
    return Invoice.query()
      .where('customerId', customerId)
      .where('userId', userId)
      .preload('customer')
      .preload('invoiceItems')
      .orderBy('createdAt', 'desc')
      .exec()
  }

  /**
   * Check if invoice number exists for user
   */
  static async invoiceNumberExistsForUser(
    invoiceNumber: string,
    userId: string,
    excludeId?: string
  ): Promise<boolean> {
    const query = Invoice.query().where('invoiceNumber', invoiceNumber).where('userId', userId)

    if (excludeId) {
      query.where('id', '!=', excludeId)
    }

    const invoice = await query.first()
    return !!invoice
  }

  /**
   * Generate next invoice number for user
   */
  static async generateNextInvoiceNumber(userId: string): Promise<string> {
    const lastInvoice = await Invoice.query()
      .where('userId', userId)
      .orderBy('createdAt', 'desc')
      .first()

    if (!lastInvoice) {
      return 'INV-001'
    }

    // Extract number from last invoice number (assuming format INV-XXX)
    const lastNumber = lastInvoice.invoiceNumber.split('-')[1]
    const nextNumber = Number.parseInt(lastNumber) + 1

    return `INV-${nextNumber.toString().padStart(3, '0')}`
  }
}

export default InvoiceRepository

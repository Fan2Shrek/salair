import Customer from '#models/customer'
import { DateTime } from 'luxon'

export interface CustomerFilterParams {
  companyName?: string
  contactName?: string
  email?: string
  created_after?: DateTime
  created_before?: DateTime
  page?: number
  limit?: number
  sort_by?: 'created_at' | 'company_name' | 'contact_name' | 'email'
  order?: 'asc' | 'desc'
}

export interface CustomerCreateData {
  userId: string
  companyName: string
  contactName: string
  email: string
  phoneNumber: string
  address: string
}

export interface CustomerUpdateData {
  companyName?: string
  contactName?: string
  email?: string
  phoneNumber?: string
  address?: string
}

export class CustomerRepository {
  /**
   * Find customer by ID
   */
  async findById(id: string): Promise<Customer | null> {
    return await Customer.find(id)
  }

  /**
   * Find customer by ID or throw
   */
  async findByIdOrFail(id: string): Promise<Customer> {
    return await Customer.findOrFail(id)
  }

  /**
   * Find customer by ID for a specific user
   */
  async findByIdForUser(id: string, userId: string): Promise<Customer | null> {
    return await Customer.query().where('id', id).where('userId', userId).first()
  }

  /**
   * Find customer by ID for a specific user or throw
   */
  async findByIdForUserOrFail(id: string, userId: string): Promise<Customer> {
    const customer = await this.findByIdForUser(id, userId)
    if (!customer) {
      throw new Error('Customer not found')
    }
    return customer
  }

  /**
   * Find customer by email for a specific user
   */
  async findByEmailForUser(email: string, userId: string): Promise<Customer | null> {
    return await Customer.query().where('email', email).where('userId', userId).first()
  }

  /**
   * Create a new customer
   */
  async create(customerData: CustomerCreateData): Promise<Customer> {
    return await Customer.create(customerData)
  }

  /**
   * Update customer
   */
  async update(customer: Customer, customerData: CustomerUpdateData): Promise<Customer> {
    customer.merge(customerData)
    await customer.save()
    return customer
  }

  /**
   * Delete customer (soft delete)
   */
  async delete(customer: Customer): Promise<void> {
    await customer.delete()
  }

  /**
   * Get filtered customers with pagination for a specific user
   */
  async getFilteredCustomers(userId: string, filters: CustomerFilterParams) {
    const query = Customer.query()
      .where('userId', userId)
      .apply((scopes) => scopes.withoutTrashed())

    // Apply filters
    if (filters.companyName) {
      query.whereILike('companyName', `%${filters.companyName}%`)
    }

    if (filters.contactName) {
      query.whereILike('contactName', `%${filters.contactName}%`)
    }

    if (filters.email) {
      query.whereILike('email', `%${filters.email}%`)
    }

    if (filters.created_after) {
      query.where('createdAt', '>=', filters.created_after.toSQL()!)
    }

    if (filters.created_before) {
      query.where('createdAt', '<=', filters.created_before.toSQL()!)
    }

    // Apply sorting
    if (filters.sort_by) {
      const sortColumn =
        filters.sort_by === 'created_at'
          ? 'createdAt'
          : filters.sort_by === 'company_name'
            ? 'companyName'
            : filters.sort_by === 'contact_name'
              ? 'contactName'
              : 'email'
      query.orderBy(sortColumn, filters.order || 'asc')
    } else {
      query.orderBy('createdAt', 'desc')
    }

    // Apply pagination or return all
    if (filters.page && filters.limit) {
      return await query.paginate(filters.page, filters.limit)
    }

    return await query.exec()
  }

  /**
   * Get all customers for a user with pagination
   */
  async getAllForUser(userId: string, page: number = 1, limit: number = 10) {
    return await Customer.query()
      .where('userId', userId)
      .apply((scopes) => scopes.withoutTrashed())
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Search customers by company name, contact name, or email for a specific user
   */
  async searchForUser(userId: string, searchTerm: string, page: number = 1, limit: number = 10) {
    return await Customer.query()
      .where('userId', userId)
      .where((query) => {
        query
          .whereILike('companyName', `%${searchTerm}%`)
          .orWhereILike('contactName', `%${searchTerm}%`)
          .orWhereILike('email', `%${searchTerm}%`)
      })
      .apply((scopes) => scopes.withoutTrashed())
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Get recent customers (last N days) for a specific user
   */
  async getRecentCustomersForUser(
    userId: string,
    days: number = 30,
    page: number = 1,
    limit: number = 10
  ) {
    const dateThreshold = DateTime.now().minus({ days }).toSQL()

    return await Customer.query()
      .where('userId', userId)
      .where('createdAt', '>=', dateThreshold)
      .apply((scopes) => scopes.withoutTrashed())
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Check if email exists for a specific user
   */
  async emailExistsForUser(email: string, userId: string): Promise<boolean> {
    const customer = await Customer.query().where('email', email).where('userId', userId).first()
    return !!customer
  }

  /**
   * Check if email exists for a specific user, excluding a specific customer
   */
  async emailExistsForUserExcluding(
    email: string,
    userId: string,
    excludeCustomerId: string
  ): Promise<boolean> {
    const customer = await Customer.query()
      .where('email', email)
      .where('userId', userId)
      .whereNot('id', excludeCustomerId)
      .first()
    return !!customer
  }

  /**
   * Get customer statistics for a specific user
   */
  async getStatisticsForUser(userId: string) {
    const totalCustomers = await Customer.query()
      .where('userId', userId)
      .apply((scopes) => scopes.withoutTrashed())
      .count('* as total')

    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toSQL()
    const recentCustomers = await Customer.query()
      .where('userId', userId)
      .where('createdAt', '>=', thirtyDaysAgo)
      .apply((scopes) => scopes.withoutTrashed())
      .count('* as total')

    const sevenDaysAgo = DateTime.now().minus({ days: 7 }).toSQL()
    const weeklyCustomers = await Customer.query()
      .where('userId', userId)
      .where('createdAt', '>=', sevenDaysAgo)
      .apply((scopes) => scopes.withoutTrashed())
      .count('* as total')

    return {
      total: Number(totalCustomers[0].$extras.total),
      recentSignups: Number(recentCustomers[0].$extras.total),
      weeklySignups: Number(weeklyCustomers[0].$extras.total),
    }
  }

  /**
   * Get customers by company name pattern for a specific user
   */
  async getByCompanyNamePattern(
    userId: string,
    pattern: string,
    page: number = 1,
    limit: number = 10
  ) {
    return await Customer.query()
      .where('userId', userId)
      .whereILike('companyName', `%${pattern}%`)
      .apply((scopes) => scopes.withoutTrashed())
      .orderBy('companyName', 'asc')
      .paginate(page, limit)
  }

  /**
   * Get customers created in a specific date range for a user
   */
  async getCustomersInDateRange(
    userId: string,
    startDate: DateTime,
    endDate: DateTime,
    page: number = 1,
    limit: number = 10
  ) {
    return await Customer.query()
      .where('userId', userId)
      .whereBetween('createdAt', [startDate.toSQL()!, endDate.toSQL()!])
      .apply((scopes) => scopes.withoutTrashed())
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Bulk delete customers for a user
   */
  async bulkDeleteForUser(customerIds: string[], userId: string): Promise<number> {
    const customers = await Customer.query()
      .whereIn('id', customerIds)
      .where('userId', userId)
      .apply((scopes) => scopes.withoutTrashed())

    let deletedCount = 0
    for (const customer of customers) {
      await customer.delete()
      deletedCount++
    }

    return deletedCount
  }

  /**
   * Get customer count for a specific user
   */
  async getCountForUser(userId: string): Promise<number> {
    const result = await Customer.query()
      .where('userId', userId)
      .apply((scopes) => scopes.withoutTrashed())
      .count('* as total')

    return Number(result[0].$extras.total)
  }
}

export default new CustomerRepository()

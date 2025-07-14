import Customer from '#models/customer'
import type User from '#models/user'
import { DateTime } from 'luxon'

export interface CustomerInsight {
  label: string
  value: number
  percentage: number
}

export interface CustomerInsightsData {
  data: CustomerInsight[]
}

export class CustomerInsightsService {
  /**
   * Get customer insights for a specific user
   */
  async getInsights(user: User): Promise<CustomerInsightsData> {
    const now = DateTime.now()
    const startOfThisMonth = now.startOf('month')

    // Get total customers
    const totalCustomers = await Customer.query()
      .where('userId', user.id)
      .apply((scopes) => scopes.withoutTrashed())

    // Get customers created this month
    const customersThisMonth = await Customer.query()
      .where('userId', user.id)
      .whereBetween('createdAt', [startOfThisMonth.toSQL()!, now.toSQL()!])
      .apply((scopes) => scopes.withoutTrashed())

    // Calculate evolution
    const customersBeforeThisMonth = totalCustomers.length - customersThisMonth.length
    const customersEvolution = this.calculatePercentageEvolution(
      customersThisMonth.length,
      customersBeforeThisMonth
    )

    // TODO: Replace hardcoded values with real calculations
    const billedCustomers = await this.getBilledCustomersCount(user.id)
    const customersWithOverduePayments = await this.getCustomersWithOverduePaymentsCount(user.id)

    return {
      data: [
        {
          label: 'Total customers',
          value: totalCustomers.length,
          percentage: customersEvolution,
        },
        {
          label: 'Clients facturés',
          value: billedCustomers.count,
          percentage: billedCustomers.evolution,
        },
        {
          label: 'Clients avec impayés',
          value: customersWithOverduePayments.count,
          percentage: customersWithOverduePayments.evolution,
        },
      ],
    }
  }

  /**
   * Calculate percentage evolution between current and previous period
   */
  private calculatePercentageEvolution(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0
    }
    return Math.round(((current - previous) / previous) * 100)
  }

  /**
   * Get count of customers who have been billed
   * TODO: Implement real logic when invoices are implemented
   */
  private async getBilledCustomersCount(
    _userId: string
  ): Promise<{ count: number; evolution: number }> {
    // For now, return hardcoded values
    // TODO: Query invoices table to get real count
    return {
      count: 4,
      evolution: -10,
    }
  }

  /**
   * Get count of customers with overdue payments
   * TODO: Implement real logic when payments are implemented
   */
  private async getCustomersWithOverduePaymentsCount(
    _userId: string
  ): Promise<{ count: number; evolution: number }> {
    // For now, return hardcoded values
    // TODO: Query invoices/payments tables to get real count
    return {
      count: 10,
      evolution: 24,
    }
  }
}

export default new CustomerInsightsService()

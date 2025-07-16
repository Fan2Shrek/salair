import Customer from '#models/customer'
import CustomerRepository from '#repositories/customer.repository'
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
   */
  private async getBilledCustomersCount(
    userId: string
  ): Promise<{ count: number; evolution: number }> {
    const now = DateTime.now()
    const startOfThisMonth = now.startOf('month')
    const startOfLastMonth = startOfThisMonth.minus({ months: 1 })

    // Get customers who have invoices this month
    const billedCustomersThisMonth = await CustomerRepository.getBilledCustomersInPeriod(
      userId,
      startOfThisMonth,
      now
    )

    // Get customers who had invoices last month
    const billedCustomersLastMonth = await CustomerRepository.getBilledCustomersInPeriod(
      userId,
      startOfLastMonth,
      startOfThisMonth
    )

    const evolution = this.calculatePercentageEvolution(
      billedCustomersThisMonth.length,
      billedCustomersLastMonth.length
    )

    return {
      count: billedCustomersThisMonth.length,
      evolution,
    }
  }

  /**
   * Get count of customers with overdue payments
   */
  private async getCustomersWithOverduePaymentsCount(
    userId: string
  ): Promise<{ count: number; evolution: number }> {
    const now = DateTime.now()
    const startOfThisMonth = now.startOf('month')
    const startOfLastMonth = startOfThisMonth.minus({ months: 1 })

    // Get customers with overdue invoices this month
    const customersWithOverdueThisMonth = await CustomerRepository.getCustomersWithOverdueInPeriod(
      userId,
      startOfThisMonth,
      now
    )

    // Get customers with overdue invoices last month
    const customersWithOverdueLastMonth = await CustomerRepository.getCustomersWithOverdueInPeriod(
      userId,
      startOfLastMonth,
      startOfThisMonth
    )

    const evolution = this.calculatePercentageEvolution(
      customersWithOverdueThisMonth.length,
      customersWithOverdueLastMonth.length
    )

    return {
      count: customersWithOverdueThisMonth.length,
      evolution,
    }
  }
}

export default new CustomerInsightsService()

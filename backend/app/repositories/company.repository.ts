import Company from '#models/company'
import { DateTime } from 'luxon'

export interface CompanyFilterParams {
  tradeName?: string
  siret?: string
  activity?: string
  status?: string
  billing_type?: string
  currency?: string
  is_vat_payer?: boolean
  created_after?: DateTime
  created_before?: DateTime
  business_start_after?: DateTime
  business_start_before?: DateTime
  page?: number
  limit?: number
  sort_by?: 'created_at' | 'trade_name' | 'siret' | 'business_start_date'
  order?: 'asc' | 'desc'
}

export interface CompanyCreateData {
  ownerId: string
  status: string
  siret: string
  activity: string
  tradeName: string
  urssafFrequency: string
  businessStartDate: DateTime
  isVatPayer: boolean
  billingType: string
  currency: string
  defaultDueDays: number
  logoUrl?: string
  defaultInvoiceNote?: string
}

export interface CompanyUpdateData {
  siret?: string
  activity?: string
  tradeName?: string
  urssafFrequency?: string
  businessStartDate?: DateTime
  isVatPayer?: boolean
  billingType?: string
  currency?: string
  defaultDueDays?: number
  logoUrl?: string
  defaultInvoiceNote?: string
  status?: string
}

export class CompanyRepository {
  /**
   * Find company by ID
   */
  async findById(id: string): Promise<Company | null> {
    return await Company.find(id)
  }

  /**
   * Find company by ID or throw
   */
  async findByIdOrFail(id: string): Promise<Company> {
    return await Company.findOrFail(id)
  }

  /**
   * Find company by ID for a specific owner
   */
  async findByIdForOwner(id: string, ownerId: string): Promise<Company | null> {
    return await Company.query().where('id', id).where('ownerId', ownerId).first()
  }

  /**
   * Find company by ID for a specific owner or throw
   */
  async findByIdForOwnerOrFail(id: string, ownerId: string): Promise<Company> {
    const company = await this.findByIdForOwner(id, ownerId)
    if (!company) {
      throw new Error('Company not found')
    }
    return company
  }

  /**
   * Find company by SIRET
   */
  async findBySiret(siret: string): Promise<Company | null> {
    return await Company.query().where('siret', siret).first()
  }

  /**
   * Find company by SIRET for a specific owner
   */
  async findBySiretForOwner(siret: string, ownerId: string): Promise<Company | null> {
    return await Company.query().where('siret', siret).where('ownerId', ownerId).first()
  }

  /**
   * Get company for a specific owner (since each user should have only one company)
   */
  async getCompanyForOwner(ownerId: string): Promise<Company | null> {
    return await Company.query().where('ownerId', ownerId).first()
  }

  /**
   * Create a new company
   */
  async create(companyData: CompanyCreateData): Promise<Company> {
    return await Company.create(companyData)
  }

  /**
   * Update company
   */
  async update(company: Company, companyData: CompanyUpdateData): Promise<Company> {
    company.merge(companyData)
    await company.save()
    return company
  }

  /**
   * Delete company (soft delete)
   */
  async delete(company: Company): Promise<void> {
    await company.delete()
  }

  /**
   * Get filtered companies with pagination
   */
  async getFilteredCompanies(filters: CompanyFilterParams) {
    const query = Company.query().apply((scopes) => scopes.withoutTrashed())

    // Apply filters
    if (filters.tradeName) {
      query.whereILike('tradeName', `%${filters.tradeName}%`)
    }

    if (filters.siret) {
      query.whereILike('siret', `%${filters.siret}%`)
    }

    if (filters.activity) {
      query.whereILike('activity', `%${filters.activity}%`)
    }

    if (filters.status) {
      query.where('status', filters.status)
    }

    if (filters.billing_type) {
      query.where('billingType', filters.billing_type)
    }

    if (filters.currency) {
      query.where('currency', filters.currency)
    }

    if (filters.is_vat_payer !== undefined) {
      query.where('isVatPayer', filters.is_vat_payer)
    }

    if (filters.created_after) {
      query.where('createdAt', '>=', filters.created_after.toSQL()!)
    }

    if (filters.created_before) {
      query.where('createdAt', '<=', filters.created_before.toSQL()!)
    }

    if (filters.business_start_after) {
      query.where('businessStartDate', '>=', filters.business_start_after.toSQL()!)
    }

    if (filters.business_start_before) {
      query.where('businessStartDate', '<=', filters.business_start_before.toSQL()!)
    }

    // Apply sorting
    if (filters.sort_by) {
      const sortColumn =
        filters.sort_by === 'created_at'
          ? 'createdAt'
          : filters.sort_by === 'trade_name'
            ? 'tradeName'
            : filters.sort_by === 'business_start_date'
              ? 'businessStartDate'
              : 'siret'
      query.orderBy(sortColumn, filters.order || 'asc')
    } else {
      query.orderBy('createdAt', 'desc')
    }

    // Load owner relation
    query.preload('owner')

    // Apply pagination or return all
    if (filters.page && filters.limit) {
      return await query.paginate(filters.page, filters.limit)
    }

    return await query.exec()
  }

  /**
   * Get all companies with pagination
   */
  async getAll(page: number = 1, limit: number = 10) {
    return await Company.query()
      .apply((scopes) => scopes.withoutTrashed())
      .preload('owner')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Search companies by trade name, activity, or SIRET
   */
  async search(searchTerm: string, page: number = 1, limit: number = 10) {
    return await Company.query()
      .where((query) => {
        query
          .whereILike('tradeName', `%${searchTerm}%`)
          .orWhereILike('activity', `%${searchTerm}%`)
          .orWhereILike('siret', `%${searchTerm}%`)
      })
      .apply((scopes) => scopes.withoutTrashed())
      .preload('owner')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Get companies by status
   */
  async getByStatus(status: string, page: number = 1, limit: number = 10) {
    return await Company.query()
      .where('status', status)
      .apply((scopes) => scopes.withoutTrashed())
      .preload('owner')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Get recent companies (last N days)
   */
  async getRecentCompanies(days: number = 30, page: number = 1, limit: number = 10) {
    const dateThreshold = DateTime.now().minus({ days }).toSQL()

    return await Company.query()
      .where('createdAt', '>=', dateThreshold)
      .apply((scopes) => scopes.withoutTrashed())
      .preload('owner')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Get companies by billing type
   */
  async getByBillingType(billingType: string, page: number = 1, limit: number = 10) {
    return await Company.query()
      .where('billingType', billingType)
      .apply((scopes) => scopes.withoutTrashed())
      .preload('owner')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Get VAT payer companies
   */
  async getVatPayers(page: number = 1, limit: number = 10) {
    return await Company.query()
      .where('isVatPayer', true)
      .apply((scopes) => scopes.withoutTrashed())
      .preload('owner')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Check if SIRET exists
   */
  async siretExists(siret: string): Promise<boolean> {
    const company = await Company.query().where('siret', siret).first()
    return !!company
  }

  /**
   * Check if SIRET exists, excluding a specific company
   */
  async siretExistsExcluding(siret: string, excludeCompanyId: string): Promise<boolean> {
    const company = await Company.query()
      .where('siret', siret)
      .whereNot('id', excludeCompanyId)
      .first()
    return !!company
  }

  /**
   * Get company statistics
   */
  async getStatistics() {
    const totalCompanies = await Company.query()
      .apply((scopes) => scopes.withoutTrashed())
      .count('* as total')

    const activeCompanies = await Company.query()
      .where('status', 'active')
      .apply((scopes) => scopes.withoutTrashed())
      .count('* as total')

    const vatPayers = await Company.query()
      .where('isVatPayer', true)
      .apply((scopes) => scopes.withoutTrashed())
      .count('* as total')

    const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toSQL()
    const recentCompanies = await Company.query()
      .where('createdAt', '>=', thirtyDaysAgo)
      .apply((scopes) => scopes.withoutTrashed())
      .count('* as total')

    const sevenDaysAgo = DateTime.now().minus({ days: 7 }).toSQL()
    const weeklyCompanies = await Company.query()
      .where('createdAt', '>=', sevenDaysAgo)
      .apply((scopes) => scopes.withoutTrashed())
      .count('* as total')

    return {
      total: Number(totalCompanies[0].$extras.total),
      active: Number(activeCompanies[0].$extras.total),
      vatPayers: Number(vatPayers[0].$extras.total),
      recentSignups: Number(recentCompanies[0].$extras.total),
      weeklySignups: Number(weeklyCompanies[0].$extras.total),
    }
  }

  /**
   * Get companies by activity sector
   */
  async getByActivityPattern(pattern: string, page: number = 1, limit: number = 10) {
    return await Company.query()
      .whereILike('activity', `%${pattern}%`)
      .apply((scopes) => scopes.withoutTrashed())
      .preload('owner')
      .orderBy('activity', 'asc')
      .paginate(page, limit)
  }

  /**
   * Get companies created in a specific date range
   */
  async getCompaniesInDateRange(
    startDate: DateTime,
    endDate: DateTime,
    page: number = 1,
    limit: number = 10
  ) {
    return await Company.query()
      .whereBetween('createdAt', [startDate.toSQL()!, endDate.toSQL()!])
      .apply((scopes) => scopes.withoutTrashed())
      .preload('owner')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Get companies by business start date range
   */
  async getCompaniesByBusinessStartRange(
    startDate: DateTime,
    endDate: DateTime,
    page: number = 1,
    limit: number = 10
  ) {
    return await Company.query()
      .whereBetween('businessStartDate', [startDate.toSQL()!, endDate.toSQL()!])
      .apply((scopes) => scopes.withoutTrashed())
      .preload('owner')
      .orderBy('businessStartDate', 'desc')
      .paginate(page, limit)
  }

  /**
   * Update company logo URL
   */
  async updateLogo(company: Company, logoUrl: string): Promise<Company> {
    company.logoUrl = logoUrl
    await company.save()
    return company
  }

  /**
   * Get companies by currency
   */
  async getByCurrency(currency: string, page: number = 1, limit: number = 10) {
    return await Company.query()
      .where('currency', currency)
      .apply((scopes) => scopes.withoutTrashed())
      .preload('owner')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)
  }

  /**
   * Bulk update company status
   */
  async bulkUpdateStatus(companyIds: string[], status: string): Promise<number> {
    const companies = await Company.query()
      .whereIn('id', companyIds)
      .apply((scopes) => scopes.withoutTrashed())

    let updatedCount = 0
    for (const company of companies) {
      company.status = status
      await company.save()
      updatedCount++
    }

    return updatedCount
  }

  /**
   * Get company count
   */
  async getCount(): Promise<number> {
    const result = await Company.query()
      .apply((scopes) => scopes.withoutTrashed())
      .count('* as total')

    return Number(result[0].$extras.total)
  }

  /**
   * Get companies with overdue invoices (would need to join with invoices)
   */
  async getCompaniesWithOverdueInvoices(page: number = 1, limit: number = 10) {
    // This would need invoice relationship, for now return active companies
    return await this.getByStatus('active', page, limit)
  }
}

export default new CompanyRepository()

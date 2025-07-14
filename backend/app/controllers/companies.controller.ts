import type { HttpContext } from '@adonisjs/core/http'
import CompanyRepository from '#repositories/company.repository'
import ErrorService from '#services/error.service'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

export default class CompaniesController {
  /**
   * Get all companies with filtering (paginated)
   */
  async index({ request, response }: HttpContext) {
    try {
      const filters = request.only([
        'tradeName',
        'siret',
        'activity',
        'status',
        'billing_type',
        'currency',
        'is_vat_payer',
        'created_after',
        'created_before',
        'business_start_after',
        'business_start_before',
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
      if (filters.business_start_after) {
        filters.business_start_after = DateTime.fromISO(filters.business_start_after)
      }
      if (filters.business_start_before) {
        filters.business_start_before = DateTime.fromISO(filters.business_start_before)
      }

      // Convert string to boolean for VAT payer filter
      if (filters.is_vat_payer !== undefined) {
        filters.is_vat_payer = filters.is_vat_payer === 'true'
      }

      // Set default pagination if not provided
      filters.page = Number.parseInt(filters.page) || 1
      filters.limit = Number.parseInt(filters.limit) || 10

      const companies = await CompanyRepository.getFilteredCompanies(filters)
      return response.ok(companies)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch companies')
    }
  }

  /**
   * Get a specific company by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      if (!params.id) {
        return ErrorService.missingRequiredField(response, 'id')
      }

      const company = await CompanyRepository.findByIdOrFail(params.id)
      await company.load('owner')
      return response.ok(company)
    } catch (error) {
      return ErrorService.companyNotFound(response)
    }
  }

  /**
   * Create a new company
   */
  async store({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!

      // Check if user already has a company
      const existingCompany = await CompanyRepository.getCompanyForOwner(user.id)
      if (existingCompany) {
        return ErrorService.conflict(response, 'User already has a company')
      }

      const companyData = request.only([
        'siret',
        'activity',
        'tradeName',
        'urssafFrequency',
        'businessStartDate',
        'isVatPayer',
        'billingType',
        'currency',
        'defaultDueDays',
        'defaultInvoiceNote',
      ])

      // Convert businessStartDate to DateTime
      if (companyData.businessStartDate) {
        companyData.businessStartDate = DateTime.fromISO(companyData.businessStartDate)
      }

      // Check if SIRET already exists
      if (await CompanyRepository.siretExists(companyData.siret)) {
        return ErrorService.conflict(response, 'SIRET already exists')
      }

      const company = await CompanyRepository.create({
        ...companyData,
        ownerId: user.id,
        status: 'active',
      })

      return response.created(company)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to create company')
    }
  }

  /**
   * Update a company
   */
  async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = auth.user!

      if (!params.id) {
        return ErrorService.missingRequiredField(response, 'id')
      }

      const company = await CompanyRepository.findByIdForOwner(params.id, user.id)

      if (!company) {
        return ErrorService.companyNotFound(response)
      }

      const companyData = request.only([
        'siret',
        'activity',
        'tradeName',
        'urssafFrequency',
        'businessStartDate',
        'isVatPayer',
        'billingType',
        'currency',
        'defaultDueDays',
        'defaultInvoiceNote',
        'status',
      ])

      // Convert businessStartDate to DateTime if provided
      if (companyData.businessStartDate) {
        companyData.businessStartDate = DateTime.fromISO(companyData.businessStartDate)
      }

      // Check if SIRET already exists for another company
      if (companyData.siret && companyData.siret !== company.siret) {
        if (await CompanyRepository.siretExistsExcluding(companyData.siret, company.id)) {
          return ErrorService.conflict(response, 'SIRET already exists')
        }
      }

      const updatedCompany = await CompanyRepository.update(company, companyData)
      return response.ok(updatedCompany)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to update company')
    }
  }

  /**
   * Delete a company (soft delete)
   */
  async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user!

      if (!params.id) {
        return ErrorService.missingRequiredField(response, 'id')
      }

      const company = await CompanyRepository.findByIdForOwner(params.id, user.id)

      if (!company) {
        return ErrorService.companyNotFound(response)
      }

      await CompanyRepository.delete(company)
      return response.noContent()
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to delete company')
    }
  }

  /**
   * Upload company logo to S3 bucket
   */
  async uploadLogo({ request, response, params, auth }: HttpContext) {
    try {
      const user = auth.user!

      if (!params.id) {
        return ErrorService.missingRequiredField(response, 'id')
      }

      const company = await CompanyRepository.findByIdForOwner(params.id, user.id)

      if (!company) {
        return ErrorService.companyNotFound(response)
      }

      const logo = request.file('file', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (!logo || !logo.isValid) {
        return ErrorService.invalidFileType(response, ['jpg', 'jpeg', 'png', 'webp'])
      }

      const filename = `${randomUUID()}.${logo.extname}`
      const key = `companies/${company.id}/logos/${filename}`

      await logo.moveToDisk(key)

      const logoUrl = logo.meta.url
      const updatedCompany = await CompanyRepository.updateLogo(company, logoUrl)

      return response.ok({ logoUrl: updatedCompany.logoUrl })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to upload company logo')
    }
  }

  /**
   * Get company for current user
   */
  async getMyCompany({ response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const company = await CompanyRepository.getCompanyForOwner(user.id)

      if (!company) {
        return ErrorService.companyNotFound(response)
      }

      return response.ok(company)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch company')
    }
  }

  /**
   * Search companies
   */
  async search({ request, response }: HttpContext) {
    try {
      const searchTerm = request.input('q')
      const page = Number.parseInt(request.input('page', 1))
      const limit = Number.parseInt(request.input('limit', 10))

      if (!searchTerm) {
        return ErrorService.missingRequiredField(response, 'q')
      }

      const companies = await CompanyRepository.search(searchTerm, page, limit)
      return response.ok(companies)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to search companies')
    }
  }

  /**
   * Get company statistics
   */
  async statistics({ response }: HttpContext) {
    try {
      const statistics = await CompanyRepository.getStatistics()
      return response.ok(statistics)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to fetch company statistics')
    }
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import Company from '#models/company'
import ErrorService from '#services/error.service'
import { randomUUID } from 'node:crypto'

export default class CompaniesController {
  /**
   * Get all companies (paginated)
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const companies = await Company.query().paginate(page, limit)
      return response.ok(companies)
    } catch (error) {
      return ErrorService.internal(response, error)
    }
  }

  /**
   * Get a specific company by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const company = await Company.findOrFail(params.id)
      return response.ok(company)
    } catch (error) {
      return ErrorService.notFound(response, 'Company not found')
    }
  }

  /**
   * Create a new company
   */
  async store({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!

      const companyData = {
        ...request.only([
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
        ]),
        ownerId: user.id,
        status: 'active',
      }

      const company = await Company.create(companyData)
      return response.created(company)
    } catch (error) {
      return ErrorService.internal(response, error)
    }
  }

  /**
   * Update a company
   */
  async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const company = await Company.findOrFail(params.id)

      if (company.ownerId !== user.id) {
        return ErrorService.authorization(response, 'You are not authorized to update this company')
      }

      company.merge(
        request.only([
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
      )

      await company.save()
      return response.ok(company)
    } catch (error) {
      return ErrorService.notFound(response, 'Company not found')
    }
  }

  /**
   * Delete a company (soft delete)
   */
  async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const company = await Company.findOrFail(params.id)

      if (company.ownerId !== user.id) {
        return ErrorService.authorization(response, 'You are not authorized to delete this company')
      }

      await company.delete()
      return response.noContent()
    } catch (error) {
      return ErrorService.notFound(response, 'Company not found')
    }
  }

  /**
   * Upload company logo to S3 bucket
   */
  async uploadLogo({ request, response, params, auth }: HttpContext) {
    try {
      const user = auth.user!
      const company = await Company.findOrFail(params.id)

      if (company.ownerId !== user.id) {
        return ErrorService.authorization(
          response,
          'You are not authorized to upload a logo for this company'
        )
      }

      const logo = request.file('file', {
        size: '2mb', // Limit file size to 2MB
        extnames: ['jpg', 'jpeg', 'png', 'webp'], // Allow only image files
      })

      if (!logo || !logo.isValid) {
        return ErrorService.validation(
          response,
          'Invalid file. Please provide a valid image file (jpg, jpeg, png, webp) under 2MB.',
          logo?.errors || []
        )
      }

      const filename = `${randomUUID()}.${logo.extname}`
      const key = `companies/${company.id}/logos/${filename}`

      await logo.moveToDisk(key)

      const logoUrl = logo.meta.url

      company.logoUrl = logoUrl
      await company.save()

      return response.ok({ logoUrl })
    } catch (error) {
      return ErrorService.notFound(response, 'Company not found')
    }
  }
}

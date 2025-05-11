import type { HttpContext } from '@adonisjs/core/http'
import Company from '#models/company'
import { randomUUID } from 'node:crypto'

export default class CompaniesController {
  /**
   * Get all companies (paginated)
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const companies = await Company.query().paginate(page, limit)

    return response.ok(companies)
  }

  /**
   * Get a specific company by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const company = await Company.findOrFail(params.id)
      return response.ok(company)
    } catch (error) {
      return response.notFound({ message: 'Company not found' })
    }
  }

  /**
   * Create a new company
   */
  async store({ request, response, auth }: HttpContext) {
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
  }

  /**
   * Update a company
   */
  async update({ params, request, response, auth }: HttpContext) {
    const user = auth.user!

    try {
      const company = await Company.findOrFail(params.id)

      // Check if user is the owner of the company
      if (company.ownerId !== user.id) {
        return response.forbidden({ message: 'You are not authorized to update this company' })
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
      return response.notFound({ message: 'Company not found' })
    }
  }

  /**
   * Delete a company
   */
  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.user!

    try {
      const company = await Company.findOrFail(params.id)

      // Check if user is the owner of the company
      if (company.ownerId !== user.id) {
        return response.forbidden({ message: 'You are not authorized to delete this company' })
      }

      await company.delete()

      return response.noContent()
    } catch (error) {
      return response.notFound({ message: 'Company not found' })
    }
  }

  /**
   * Upload company logo to S3 bucket
   */
  async uploadLogo({ request, response, params, auth }: HttpContext) {
    const user = auth.user!

    try {
      const company = await Company.findOrFail(params.id)

      // Check if user is the owner of the company
      if (company.ownerId !== user.id) {
        return response.forbidden({
          message: 'You are not authorized to upload a logo for this company',
        })
      }

      // Handle logo upload
      const logo = request.file('logo', {
        size: '2mb', // Limit file size to 2MB
        extnames: ['jpg', 'jpeg', 'png', 'webp'], // Allow only image files
      })

      if (!logo || !logo.isValid) {
        return response.badRequest({
          message:
            'Invalid file. Please provide a valid image file (jpg, jpeg, png, webp) under 2MB.',
          errors: logo?.errors || [],
        })
      }

      // Generate a unique filename for the logo
      const filename = `${randomUUID()}.${logo.extname}`
      const key = `companies/${company.id}/logos/${filename}`

      // Upload the file to the S3 bucket
      await logo.moveToDisk(key)

      // Generate the public URL for the uploaded file
      const logoUrl = logo.meta.url

      // Update the company with the new logo URL
      company.logoUrl = logoUrl
      await company.save()

      return response.ok({ logoUrl })
    } catch (error) {
      return response.notFound({ message: 'Company not found' })
    }
  }
}

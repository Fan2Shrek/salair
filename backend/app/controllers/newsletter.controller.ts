import NewsletterSubscriber from '#models/newsletter_subscriber'
import { newsletterValidator } from '#validators/newsletter'
import ErrorService from '#services/error.service'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewsletterController {
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const subscribers = await NewsletterSubscriber.query().paginate(page, limit)
      return response.ok(subscribers)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to retrieve newsletter subscribers')
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const { email } = await request.validateUsing(newsletterValidator)

      const newsletterSubscriber = await NewsletterSubscriber.create({
        email,
      })

      if (!newsletterSubscriber) {
        return ErrorService.internal(response, new Error('Failed to create newsletter subscriber'))
      }

      return response.created(newsletterSubscriber)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to subscribe to newsletter')
    }
  }
}

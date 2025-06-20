import NewsletterSubscriber from '#models/newsletter_subscriber'
import { newsletterValidator } from '#validators/newsletter'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewsletterController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const subscribers = await NewsletterSubscriber.query().paginate(page, limit)

    return response.ok(subscribers)
  }

  async store({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(newsletterValidator)

    const newsletterSubscriber = await NewsletterSubscriber.create({
      email,
    })

    if (newsletterSubscriber) {
      return response.created(newsletterSubscriber)
    } else {
      return response.badRequest({ message: 'An error occured' })
    }
  }
}

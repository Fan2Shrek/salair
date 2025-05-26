import NewsletterSubscriber from '#models/newsletter_subscriber'
import { newsletterValidator } from '#validators/newsletter'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewslettersController {
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

import InboundMail from '#models/inbound_mail'
import ErrorService from '#services/error.service'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import logger from '@adonisjs/core/services/logger'

export default class InboundMailsController {
  async receive({ request, response }: HttpContext) {
    try {
      const data = request.all()

      const inboudMail = await InboundMail.create({
        from: data.sender,
        subject: data.subject,
        to: data.recipient,
        text: data['body-plain'],
        html: data['html-plain'],
      })

      if (inboudMail.to === 'contact@salair.fr') {
        await mail.send((message) => {
          message
            .to(inboudMail.from)
            .from('Support Salair <contact@salair.fr>')
            .subject('Demande de contact reçue !')
            .text(
              `Bonjour, 
              
              Votre demande de contact a bien été reçue. Elle sera traitée rapidement par un membre de notre équipe.
              
              Cordialement,
              L'équipe Salair`
            )
        })
      }

      logger.info(`📥 Mail received from ${inboudMail.from}`, {
        from: inboudMail.from,
        to: inboudMail.to,
        subject: inboudMail.subject,
      })

      return response.ok({ success: true })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to process inbound mail')
    }
  }

  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const mails = await InboundMail.query().paginate(page, limit)
      return response.ok(mails)
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to retrieve inbound mails')
    }
  }
}

import InboundMail from '#models/inbound_mail'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class InboundMailsController {
  async receive({ request, response }: HttpContext) {
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

    console.log(`📥 Mail recevied from ${inboudMail.from}`)

    return response.ok({ success: true })
  }

  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const mails = await InboundMail.query().paginate(page, limit)

    return response.ok(mails)
  }
}

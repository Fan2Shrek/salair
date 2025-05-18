import InboundMail from '#models/inbound_mail'
import type { HttpContext } from '@adonisjs/core/http'

export default class InboundMailsController {
  async receive({ request, response }: HttpContext) {
    const data = request.all()

    const inboudMail = await InboundMail.create({
      from: data.from,
      subject: data.subject,
      to: data.to || data['To'] || 'unknown',
      text: data['body-plain'],
      html: data['html-plain'],
    })

    console.log(`📥 Mail recevied from ${inboudMail.from}`)

    return response.ok({ success: true })
  }
}

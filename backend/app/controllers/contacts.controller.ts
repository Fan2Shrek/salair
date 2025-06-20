import ContactRequest from '#models/contact_request'
import { contactValidator } from '#validators/contact'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class ContactsController {
  async receive({ request, response }: HttpContext) {
    const { firstName, lastName, email, phoneNumber, message, isAgreeingPrivacy } =
      await request.validateUsing(contactValidator)

    const contactRequest = await ContactRequest.create({
      firstName,
      lastName,
      email,
      message,
      phoneNumber,
      isAgreeingPrivacy,
    })

    if (contactRequest) {
      await mail.send((sendingMessage) => {
        sendingMessage
          .to(email)
          .from('Salair <noreply@salair.fr>')
          .subject(`[#${contactRequest.id}] Demande de contact`)
          .htmlView('mails/contact', {
            firstName: contactRequest.firstName,
            lastName: contactRequest.lastName,
          })
      })

      return response.ok({ message: 'Contact request successfully done' })
    } else {
      return response.badRequest({ message: 'An error occured' })
    }
  }
}

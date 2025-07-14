import ContactRequest from '#models/contact_request'
import { contactValidator } from '#validators/contact'
import ErrorService from '#services/error.service'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class ContactsController {
  async receive({ request, response }: HttpContext) {
    try {
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

      if (!contactRequest) {
        return ErrorService.internal(response, new Error('Failed to create contact request'))
      }

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

      return response.ok({ message: 'Contact request successfully submitted' })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to process contact request')
    }
  }
}

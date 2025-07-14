import ContactRequest from '#models/contact_request'
import { contactValidator } from '#validators/contact'
import ErrorService from '#services/error.service'
import EmailService from '#services/email.service'
import type { HttpContext } from '@adonisjs/core/http'

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

      await EmailService.sendContactConfirmationEmail({
        contactRequest,
      })

      return response.ok({ message: 'Contact request successfully submitted' })
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to process contact request')
    }
  }
}

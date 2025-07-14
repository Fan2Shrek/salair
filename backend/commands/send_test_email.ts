import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import EmailService from '#services/email.service'

export default class SendTestEmail extends BaseCommand {
  public static commandName = 'send:test-email'
  public static description = 'Envoie un mail de test via Mailgun'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    try {
      await EmailService.sendTestEmail('nassimlnd37@gmail.com')
      this.logger.success('The test email has been sent.')
    } catch (error) {
      this.logger.error('An error occurred during the email sending')
      console.log(error)
    }
  }
}

import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import mail from '@adonisjs/mail/services/main'

export default class SendTestEmail extends BaseCommand {
  public static commandName = 'send:test-email'
  public static description = 'Envoie un mail de test via Mailgun'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    try {
      await mail.send((message) => {
        message
          .to('Nassim LOUNADI <nassimlnd37@gmail.com>')
          .from('Mailgun Sandbox <postmaster@salair.fr>')
          .subject('Hello Nassim LOUNADI')
          .text(
            'Congratulations Nassim LOUNADI, you just sent an email with Mailgun! You are truly awesome!'
          )
      }, {})

      this.logger.success('The test email has been sent.')
    } catch (error) {
      this.logger.error('An error occured during the email sending')
      console.log(error)
    }
  }
}

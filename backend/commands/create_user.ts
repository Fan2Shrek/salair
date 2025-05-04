import User from '#models/user'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class CreateUser extends BaseCommand {
  static commandName = 'create:user'
  static description = 'Create a user'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const firstName = await this.prompt.ask('Enter the first name')
    const lastName = await this.prompt.ask('Enter the last name')
    const email = await this.prompt.ask('Enter the email')
    const password = await this.prompt.secure('Enter the password', {
      validate(value) {
        return value.length < 6 ? 'Password must be 6 characters long' : true
      },
    })

    try {
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        isVerified: true,
      })

      if (user) {
        this.logger.success(`User ${email} was created.`)
      }
    } catch (error) {
      this.logger.error('An error occured during the creation of the user')
      this.logger.error(error.message)
    }
  }
}

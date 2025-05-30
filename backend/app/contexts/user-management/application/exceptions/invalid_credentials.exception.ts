export class InvalidCredentialsException extends Error {
  constructor() {
    super('Invalid email or password')

    this.name = 'InvalidCredentialsException'
  }

  serialize() {
    return {
      name: this.name,
      code: 'E_INVALID_CREDENTIALS',
      date: new Date().toISOString(),
      message: this.message,
    }
  }
}

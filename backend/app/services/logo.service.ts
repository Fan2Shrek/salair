import env from '#start/env'
import { LogoResponseDto } from '../../types/dtos/logo_response.dto.js'

/**
 * Service responsible for communicating with the Logo.dev service.
 * Handles logo-related operations and API interactions with Logo.dev.
 */
export class LogoService {
  private static readonly TOKEN = env.get('LOGO_DEV_TOKEN', '')

  static async search(query: string) {
    const response = await fetch(encodeURI(`https://api.logo.dev/search?q=${query}`), {
      headers: {
        Authorization: `Bearer: ${this.TOKEN}`,
      },
    })

    const data = await response.json()

    return data as LogoResponseDto
  }
}

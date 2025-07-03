export interface LogoResponseDto
  extends Array<{
    name: string
    domain: string
    logo_url: string
  }> {}

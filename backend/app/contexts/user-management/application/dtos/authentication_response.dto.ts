export class AuthenticationResponseDTO {
  constructor(
    public accessToken: string,
    public refreshToken: string
  ) {}
}

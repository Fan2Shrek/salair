export interface LoginResponseDto {
    twoFactorRequired?: boolean
    access_token?: string
    refresh_token?: string
}
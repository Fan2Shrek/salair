// Error types and codes for frontend integration
// This file should be kept in sync with backend/app/services/error.service.ts

export interface ErrorResponse {
  message: string
  code?: string
  details?: any
  timestamp?: string
}

export enum ErrorCode {
  // Authentication errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  
  // Authorization errors
  ACCESS_DENIED = 'ACCESS_DENIED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_ACCESS_DENIED = 'RESOURCE_ACCESS_DENIED',
  
  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_SIREN = 'INVALID_SIREN',
  INVALID_BILLING_CYCLE = 'INVALID_BILLING_CYCLE',
  
  // Business logic errors
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  SIREN_ALREADY_EXISTS = 'SIREN_ALREADY_EXISTS',
  TWO_FA_NOT_ENABLED = 'TWO_FA_NOT_ENABLED',
  TWO_FA_ALREADY_ENABLED = 'TWO_FA_ALREADY_ENABLED',
  TWO_FA_SECRET_NOT_GENERATED = 'TWO_FA_SECRET_NOT_GENERATED',
  INVALID_TWO_FA_TOKEN = 'INVALID_TWO_FA_TOKEN',
  PASSWORD_RESET_NOT_REQUESTED = 'PASSWORD_RESET_NOT_REQUESTED',
  INVALID_RESET_CODE = 'INVALID_RESET_CODE',
  RESET_CODE_EXPIRED = 'RESET_CODE_EXPIRED',
  
  // Resource errors
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  COMPANY_NOT_FOUND = 'COMPANY_NOT_FOUND',
  CUSTOMER_NOT_FOUND = 'CUSTOMER_NOT_FOUND',
  INVOICE_NOT_FOUND = 'INVOICE_NOT_FOUND',
  PLAN_NOT_FOUND = 'PLAN_NOT_FOUND',
  
  // External service errors
  SIRENE_API_ERROR = 'SIRENE_API_ERROR',
  SIRENE_COMPANY_NOT_FOUND = 'SIRENE_COMPANY_NOT_FOUND',
  LOGO_SERVICE_ERROR = 'LOGO_SERVICE_ERROR',
  EMAIL_SERVICE_ERROR = 'EMAIL_SERVICE_ERROR',
  
  // General errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

// Error messages for frontend display (French)
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Authentication errors
  [ErrorCode.INVALID_CREDENTIALS]: 'Identifiants invalides',
  [ErrorCode.ACCOUNT_SUSPENDED]: 'Compte suspendu',
  [ErrorCode.TOKEN_EXPIRED]: 'Session expirée, veuillez vous reconnecter',
  [ErrorCode.INVALID_TOKEN]: 'Token invalide',
  [ErrorCode.INVALID_REFRESH_TOKEN]: 'Token de rafraîchissement invalide',
  
  // Authorization errors
  [ErrorCode.ACCESS_DENIED]: 'Accès refusé',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Permissions insuffisantes',
  [ErrorCode.RESOURCE_ACCESS_DENIED]: 'Accès à cette ressource refusé',
  
  // Validation errors
  [ErrorCode.INVALID_INPUT]: 'Données invalides',
  [ErrorCode.MISSING_REQUIRED_FIELD]: 'Champ requis manquant',
  [ErrorCode.INVALID_EMAIL]: 'Adresse email invalide',
  [ErrorCode.INVALID_FILE_TYPE]: 'Type de fichier invalide',
  [ErrorCode.FILE_TOO_LARGE]: 'Fichier trop volumineux',
  [ErrorCode.INVALID_SIREN]: 'Numéro SIREN invalide',
  [ErrorCode.INVALID_BILLING_CYCLE]: 'Cycle de facturation invalide',
  
  // Business logic errors
  [ErrorCode.EMAIL_ALREADY_EXISTS]: 'Cette adresse email est déjà utilisée',
  [ErrorCode.SIREN_ALREADY_EXISTS]: 'Ce numéro SIREN est déjà utilisé',
  [ErrorCode.TWO_FA_NOT_ENABLED]: 'L\'authentification à deux facteurs n\'est pas activée',
  [ErrorCode.TWO_FA_ALREADY_ENABLED]: 'L\'authentification à deux facteurs est déjà activée',
  [ErrorCode.TWO_FA_SECRET_NOT_GENERATED]: 'Le secret 2FA n\'a pas été généré',
  [ErrorCode.INVALID_TWO_FA_TOKEN]: 'Code d\'authentification invalide',
  [ErrorCode.PASSWORD_RESET_NOT_REQUESTED]: 'Aucune demande de réinitialisation de mot de passe',
  [ErrorCode.INVALID_RESET_CODE]: 'Code de réinitialisation invalide',
  [ErrorCode.RESET_CODE_EXPIRED]: 'Code de réinitialisation expiré',
  
  // Resource errors
  [ErrorCode.USER_NOT_FOUND]: 'Utilisateur non trouvé',
  [ErrorCode.COMPANY_NOT_FOUND]: 'Entreprise non trouvée',
  [ErrorCode.CUSTOMER_NOT_FOUND]: 'Client non trouvé',
  [ErrorCode.INVOICE_NOT_FOUND]: 'Facture non trouvée',
  [ErrorCode.PLAN_NOT_FOUND]: 'Plan non trouvé',
  
  // External service errors
  [ErrorCode.SIRENE_API_ERROR]: 'Erreur du service SIRENE',
  [ErrorCode.SIRENE_COMPANY_NOT_FOUND]: 'Entreprise non trouvée dans la base SIRENE',
  [ErrorCode.LOGO_SERVICE_ERROR]: 'Erreur du service de logo',
  [ErrorCode.EMAIL_SERVICE_ERROR]: 'Erreur du service email',
  
  // General errors
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Erreur interne du serveur',
  [ErrorCode.DATABASE_ERROR]: 'Erreur de base de données',
  [ErrorCode.NETWORK_ERROR]: 'Erreur réseau',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Limite de taux dépassée',
}

// Helper function to get user-friendly error message
export function getErrorMessage(error: ErrorResponse): string {
  if (error.code && error.code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error.code as ErrorCode]
  }
  return error.message || 'Une erreur inattendue s\'est produite'
}

// Helper function to check if error is a specific code
export function isErrorCode(error: ErrorResponse, code: ErrorCode): boolean {
  return error.code === code
}

// Helper function to check if error requires authentication
export function isAuthError(error: ErrorResponse): boolean {
  const authCodes = [
    ErrorCode.INVALID_CREDENTIALS,
    ErrorCode.TOKEN_EXPIRED,
    ErrorCode.INVALID_TOKEN,
    ErrorCode.INVALID_REFRESH_TOKEN,
  ]
  return authCodes.includes(error.code as ErrorCode)
}

// Helper function to check if error is a validation error
export function isValidationError(error: ErrorResponse): boolean {
  const validationCodes = [
    ErrorCode.INVALID_INPUT,
    ErrorCode.MISSING_REQUIRED_FIELD,
    ErrorCode.INVALID_EMAIL,
    ErrorCode.INVALID_FILE_TYPE,
    ErrorCode.FILE_TOO_LARGE,
    ErrorCode.INVALID_SIREN,
    ErrorCode.INVALID_BILLING_CYCLE,
  ]
  return validationCodes.includes(error.code as ErrorCode)
}

// Helper function to check if error is a business logic error
export function isBusinessLogicError(error: ErrorResponse): boolean {
  const businessCodes = [
    ErrorCode.EMAIL_ALREADY_EXISTS,
    ErrorCode.SIREN_ALREADY_EXISTS,
    ErrorCode.TWO_FA_NOT_ENABLED,
    ErrorCode.TWO_FA_ALREADY_ENABLED,
    ErrorCode.TWO_FA_SECRET_NOT_GENERATED,
    ErrorCode.INVALID_TWO_FA_TOKEN,
    ErrorCode.PASSWORD_RESET_NOT_REQUESTED,
    ErrorCode.INVALID_RESET_CODE,
    ErrorCode.RESET_CODE_EXPIRED,
  ]
  return businessCodes.includes(error.code as ErrorCode)
}
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { Exception } from '@adonisjs/core/exceptions'

export interface ErrorResponse {
  message: string
  code?: string
  details?: any
  timestamp?: string
}

export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC_ERROR',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
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

export class ApplicationError extends Exception {
  public errorType: ErrorType
  public context?: any

  constructor(message: string, errorType: ErrorType, status: number = 500, context?: any) {
    super(message, { status })
    this.errorType = errorType
    this.context = context
  }
}

export class ErrorService {
  /**
   * Create a standardized error response
   */
  private createErrorResponse(message: string, code?: string, details?: any): ErrorResponse {
    return {
      message,
      code,
      details: process.env.NODE_ENV === 'production' ? undefined : details,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Log error with context
   */
  private logError(error: any, context?: any) {
    logger.error(error, context)
  }

  /**
   * Handle validation errors
   */
  validation(response: HttpContext['response'], message: string, details?: any, code?: ErrorCode) {
    this.logError(message, { type: 'validation', details, code })
    return response.badRequest(
      this.createErrorResponse(message, code || ErrorCode.INVALID_INPUT, details)
    )
  }

  /**
   * Handle authentication errors
   */
  authentication(
    response: HttpContext['response'],
    message: string = 'Authentication required',
    code?: ErrorCode
  ) {
    this.logError(message, { type: 'authentication', code })
    return response.unauthorized(
      this.createErrorResponse(message, code || ErrorCode.INVALID_CREDENTIALS)
    )
  }

  /**
   * Handle authorization errors
   */
  authorization(
    response: HttpContext['response'],
    message: string = 'Access denied',
    code?: ErrorCode
  ) {
    this.logError(message, { type: 'authorization', code })
    return response.forbidden(this.createErrorResponse(message, code || ErrorCode.ACCESS_DENIED))
  }

  /**
   * Handle not found errors
   */
  notFound(
    response: HttpContext['response'],
    message: string = 'Resource not found',
    code?: ErrorCode
  ) {
    this.logError(message, { type: 'not_found', code })
    return response.notFound(this.createErrorResponse(message, code || ErrorCode.USER_NOT_FOUND))
  }

  /**
   * Handle conflict errors
   */
  conflict(response: HttpContext['response'], message: string, code?: ErrorCode) {
    this.logError(message, { type: 'conflict', code })
    return response.conflict(
      this.createErrorResponse(message, code || ErrorCode.EMAIL_ALREADY_EXISTS)
    )
  }

  /**
   * Handle business logic errors
   */
  businessLogic(
    response: HttpContext['response'],
    message: string,
    details?: any,
    code?: ErrorCode
  ) {
    this.logError(message, { type: 'business_logic', details, code })
    return response.badRequest(
      this.createErrorResponse(message, code || ErrorCode.INVALID_INPUT, details)
    )
  }

  /**
   * Handle external service errors
   */
  externalService(
    response: HttpContext['response'],
    message: string,
    serviceName?: string,
    code?: ErrorCode
  ) {
    this.logError(message, { type: 'external_service', serviceName, code })
    return response.badRequest(
      this.createErrorResponse(
        'External service error',
        code || ErrorCode.SIRENE_API_ERROR,
        process.env.NODE_ENV === 'production'
          ? undefined
          : { originalMessage: message, serviceName }
      )
    )
  }

  /**
   * Handle internal server errors
   */
  internal(
    response: HttpContext['response'],
    error: any,
    message: string = 'Internal server error',
    code?: ErrorCode
  ) {
    this.logError(error, { type: 'internal', message, code })
    return response.internalServerError(
      this.createErrorResponse(
        message,
        code || ErrorCode.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === 'production' ? undefined : error
      )
    )
  }

  /**
   * Handle service exceptions thrown by business logic
   */
  handleServiceException(response: HttpContext['response'], error: any) {
    if (error instanceof ApplicationError) {
      switch (error.errorType) {
        case ErrorType.VALIDATION:
          return this.validation(response, error.message, error.context)
        case ErrorType.AUTHENTICATION:
          return this.authentication(response, error.message)
        case ErrorType.AUTHORIZATION:
          return this.authorization(response, error.message)
        case ErrorType.NOT_FOUND:
          return this.notFound(response, error.message)
        case ErrorType.CONFLICT:
          return this.conflict(response, error.message)
        case ErrorType.BUSINESS_LOGIC:
          return this.businessLogic(response, error.message, error.context)
        case ErrorType.EXTERNAL_SERVICE:
          return this.externalService(response, error.message, error.context?.serviceName)
        default:
          return this.internal(response, error, error.message)
      }
    }

    // Handle generic errors
    this.logError(error, { type: 'unhandled_exception' })
    return this.internal(response, error)
  }

  /**
   * Create business logic exceptions
   */
  createBusinessError(message: string, context?: any): ApplicationError {
    return new ApplicationError(message, ErrorType.BUSINESS_LOGIC, 400, context)
  }

  /**
   * Create authentication exceptions
   */
  createAuthError(message: string): ApplicationError {
    return new ApplicationError(message, ErrorType.AUTHENTICATION, 401)
  }

  /**
   * Create authorization exceptions
   */
  createAuthorizationError(message: string): ApplicationError {
    return new ApplicationError(message, ErrorType.AUTHORIZATION, 403)
  }

  /**
   * Create not found exceptions
   */
  createNotFoundError(message: string): ApplicationError {
    return new ApplicationError(message, ErrorType.NOT_FOUND, 404)
  }

  /**
   * Create external service exceptions
   */
  createExternalServiceError(message: string, serviceName: string): ApplicationError {
    return new ApplicationError(message, ErrorType.EXTERNAL_SERVICE, 400, { serviceName })
  }

  // Utility methods for common error scenarios

  /**
   * User not found error
   */
  userNotFound(response: HttpContext['response']) {
    return this.notFound(response, 'User not found', ErrorCode.USER_NOT_FOUND)
  }

  /**
   * Company not found error
   */
  companyNotFound(response: HttpContext['response']) {
    return this.notFound(response, 'Company not found', ErrorCode.COMPANY_NOT_FOUND)
  }

  /**
   * Customer not found error
   */
  customerNotFound(response: HttpContext['response']) {
    return this.notFound(response, 'Customer not found', ErrorCode.CUSTOMER_NOT_FOUND)
  }

  /**
   * Invalid credentials error
   */
  invalidCredentials(response: HttpContext['response']) {
    return this.authentication(response, 'Invalid credentials', ErrorCode.INVALID_CREDENTIALS)
  }

  /**
   * Account suspended error
   */
  accountSuspended(response: HttpContext['response']) {
    return this.authorization(response, 'Account suspended', ErrorCode.ACCOUNT_SUSPENDED)
  }

  /**
   * Token expired error
   */
  tokenExpired(response: HttpContext['response']) {
    return this.authentication(response, 'Token expired', ErrorCode.TOKEN_EXPIRED)
  }

  /**
   * Invalid refresh token error
   */
  invalidRefreshToken(response: HttpContext['response']) {
    return this.authentication(response, 'Invalid refresh token', ErrorCode.INVALID_REFRESH_TOKEN)
  }

  /**
   * Resource access denied error
   */
  resourceAccessDenied(response: HttpContext['response'], resource: string) {
    return this.authorization(
      response,
      `Access denied to ${resource}`,
      ErrorCode.RESOURCE_ACCESS_DENIED
    )
  }

  /**
   * Missing required field error
   */
  missingRequiredField(response: HttpContext['response'], field: string) {
    return this.validation(
      response,
      `${field} is required`,
      { field },
      ErrorCode.MISSING_REQUIRED_FIELD
    )
  }

  /**
   * Invalid file type error
   */
  invalidFileType(response: HttpContext['response'], allowedTypes: string[]) {
    return this.validation(
      response,
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      { allowedTypes },
      ErrorCode.INVALID_FILE_TYPE
    )
  }

  /**
   * File too large error
   */
  fileTooLarge(response: HttpContext['response'], maxSize: string) {
    return this.validation(
      response,
      `File too large. Maximum size: ${maxSize}`,
      { maxSize },
      ErrorCode.FILE_TOO_LARGE
    )
  }

  /**
   * Invalid SIREN error
   */
  invalidSiren(response: HttpContext['response']) {
    return this.validation(response, 'Invalid SIREN number', undefined, ErrorCode.INVALID_SIREN)
  }

  /**
   * Email already exists error
   */
  emailAlreadyExists(response: HttpContext['response']) {
    return this.conflict(response, 'Email already exists', ErrorCode.EMAIL_ALREADY_EXISTS)
  }

  /**
   * 2FA not enabled error
   */
  twoFactorNotEnabled(response: HttpContext['response']) {
    return this.businessLogic(
      response,
      '2FA is not enabled',
      undefined,
      ErrorCode.TWO_FA_NOT_ENABLED
    )
  }

  /**
   * Invalid 2FA token error
   */
  invalidTwoFactorToken(response: HttpContext['response']) {
    return this.validation(response, 'Invalid 2FA token', undefined, ErrorCode.INVALID_TWO_FA_TOKEN)
  }

  /**
   * 2FA secret not generated error
   */
  twoFactorSecretNotGenerated(response: HttpContext['response']) {
    return this.businessLogic(
      response,
      '2FA secret not generated yet',
      undefined,
      ErrorCode.TWO_FA_SECRET_NOT_GENERATED
    )
  }

  /**
   * Invalid reset code error
   */
  invalidResetCode(response: HttpContext['response']) {
    return this.validation(response, 'Invalid reset code', undefined, ErrorCode.INVALID_RESET_CODE)
  }

  /**
   * Password reset not requested error
   */
  passwordResetNotRequested(response: HttpContext['response']) {
    return this.businessLogic(
      response,
      'No password reset request detected',
      undefined,
      ErrorCode.PASSWORD_RESET_NOT_REQUESTED
    )
  }

  /**
   * SIRENE API error
   */
  sireneApiError(response: HttpContext['response'], message: string = 'SIRENE API error') {
    return this.externalService(response, message, 'SIRENE API', ErrorCode.SIRENE_API_ERROR)
  }

  /**
   * Company not found in SIRENE
   */
  sireneCompanyNotFound(response: HttpContext['response']) {
    return this.externalService(
      response,
      'Company not found in SIRENE database',
      'SIRENE API',
      ErrorCode.SIRENE_COMPANY_NOT_FOUND
    )
  }

  /**
   * Invalid billing cycle error
   */
  invalidBillingCycle(response: HttpContext['response']) {
    return this.validation(
      response,
      'Invalid billing cycle. Must be "monthly", "yearly", or "both"',
      undefined,
      ErrorCode.INVALID_BILLING_CYCLE
    )
  }
}

export default new ErrorService()

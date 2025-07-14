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
  validation(response: HttpContext['response'], message: string, details?: any) {
    this.logError(message, { type: 'validation', details })
    return response.badRequest(this.createErrorResponse(message, ErrorType.VALIDATION, details))
  }

  /**
   * Handle authentication errors
   */
  authentication(response: HttpContext['response'], message: string = 'Authentication required') {
    this.logError(message, { type: 'authentication' })
    return response.unauthorized(this.createErrorResponse(message, ErrorType.AUTHENTICATION))
  }

  /**
   * Handle authorization errors
   */
  authorization(response: HttpContext['response'], message: string = 'Access denied') {
    this.logError(message, { type: 'authorization' })
    return response.forbidden(this.createErrorResponse(message, ErrorType.AUTHORIZATION))
  }

  /**
   * Handle not found errors
   */
  notFound(response: HttpContext['response'], message: string = 'Resource not found') {
    this.logError(message, { type: 'not_found' })
    return response.notFound(this.createErrorResponse(message, ErrorType.NOT_FOUND))
  }

  /**
   * Handle conflict errors
   */
  conflict(response: HttpContext['response'], message: string) {
    this.logError(message, { type: 'conflict' })
    return response.conflict(this.createErrorResponse(message, ErrorType.CONFLICT))
  }

  /**
   * Handle business logic errors
   */
  businessLogic(response: HttpContext['response'], message: string, details?: any) {
    this.logError(message, { type: 'business_logic', details })
    return response.badRequest(this.createErrorResponse(message, ErrorType.BUSINESS_LOGIC, details))
  }

  /**
   * Handle external service errors
   */
  externalService(response: HttpContext['response'], message: string, serviceName?: string) {
    this.logError(message, { type: 'external_service', serviceName })
    return response.badRequest(
      this.createErrorResponse(
        'External service error',
        ErrorType.EXTERNAL_SERVICE,
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
    message: string = 'Internal server error'
  ) {
    this.logError(error, { type: 'internal', message })
    return response.internalServerError(
      this.createErrorResponse(
        message,
        ErrorType.INTERNAL,
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
}

export default new ErrorService()

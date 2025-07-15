import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import ErrorService from '#services/error.service'
import CustomerRepository from '#repositories/customer.repository'
import CompanyRepository from '#repositories/company.repository'
import UserRepository from '#repositories/user.repository'

/**
 * Resource ownership middleware to ensure users can only access their own resources
 */
export default class ResourceOwnershipMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      resourceType?: 'customer' | 'company' | 'user' | 'invoice' | 'payment'
      paramName?: string
      allowAdmin?: boolean
    } = {}
  ) {
    const { resourceType = 'customer', paramName = 'id', allowAdmin = true } = options
    const { auth, params, response } = ctx

    try {
      // Ensure user is authenticated
      await auth.use('api').authenticate()
      const user = auth.user!

      // Admin bypass (if enabled)
      if (allowAdmin && user.role === 'admin') {
        return next()
      }

      // Get resource ID from params
      const resourceId = params[paramName]
      if (!resourceId) {
        return ErrorService.missingRequiredField(response, paramName)
      }

      // Check ownership based on resource type
      const hasAccess = await this.checkResourceOwnership(resourceType, resourceId, user.id)

      if (!hasAccess) {
        return ErrorService.resourceAccessDenied(response, resourceType)
      }

      return next()
    } catch (error) {
      return ErrorService.internal(response, error, 'Failed to verify resource ownership')
    }
  }

  /**
   * Check if user has access to the specified resource
   */
  private async checkResourceOwnership(
    resourceType: string,
    resourceId: string,
    userId: string
  ): Promise<boolean> {
    try {
      switch (resourceType) {
        case 'customer':
          const customer = await CustomerRepository.findByIdForUser(resourceId, userId)
          return !!customer

        case 'company':
          const company = await CompanyRepository.findByIdForOwner(resourceId, userId)
          return !!company

        case 'user':
          // For user resources, check if the resource ID matches the authenticated user ID
          // or if the user exists and belongs to the same organization/context
          const targetUser = await UserRepository.findById(resourceId)
          return targetUser ? targetUser.id === userId : false

        default:
          return false
      }
    } catch (error) {
      // If resource doesn't exist or any error occurs, deny access
      return false
    }
  }
}

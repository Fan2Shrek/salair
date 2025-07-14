import type { HttpContext } from '@adonisjs/core/http'
import Plan from '../models/plan.js'
import ErrorService from '#services/error.service'

export default class PlansController {
  /**
   * Récupère la liste des plans filtrés par cycle de facturation
   *
   * @param ctx - HttpContext de la requête
   */
  public async index({ request, response }: HttpContext) {
    try {
      const billingCycle = request.qs().billingCycle || 'both'

      if (!['monthly', 'yearly', 'both'].includes(billingCycle)) {
        return ErrorService.invalidBillingCycle(response)
      }

      let plans

      if (billingCycle === 'both') {
        plans = await Plan.query().orderBy('priceCents', 'asc')
      } else {
        plans = await Plan.query().where('billingCycle', billingCycle).orderBy('priceCents', 'asc')
      }

      return response.ok(plans)
    } catch (error) {
      return ErrorService.internal(response, error, 'An error occurred while retrieving plans')
    }
  }
}

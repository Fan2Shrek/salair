import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import Subscription from './subscription.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { v7 } from 'uuid'

export default class Plan extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static generateId(plan: Plan) {
    plan.id = v7()
  }

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @column()
  declare priceCents: number

  @column()
  declare currency: string

  @column()
  declare billingCycle: 'yearly' | 'monthly'

  @column()
  declare isPopular: boolean

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
  })
  declare features: string[]

  @column()
  declare stripePriceId: string

  @hasMany(() => Subscription)
  declare subscriptions: HasMany<typeof Subscription>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

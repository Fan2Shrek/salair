import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Plan from './plan.js'
import { v7 } from 'uuid'

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static generateId(subscription: Subscription) {
    subscription.id = v7()
  }

  @column()
  declare userId: string

  @column()
  declare planId: string

  @column()
  declare stripeSubscriptionId: string

  @column()
  declare status: 'active' | 'trialing' | 'canceled' | 'past_due'

  @column.dateTime()
  declare startedAt: DateTime

  @column.dateTime()
  declare endsAt: DateTime

  @column.dateTime()
  declare canceledAt: DateTime

  @column()
  declare isTrial: boolean

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Plan)
  declare plan: BelongsTo<typeof Plan>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

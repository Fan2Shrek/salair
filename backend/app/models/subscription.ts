import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Plan from './plan.js'

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare planId: number

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

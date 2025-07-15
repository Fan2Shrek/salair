import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import Invoice from './invoice.js'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { v7 } from 'uuid'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static generateId(payment: Payment) {
    payment.id = v7()
  }

  @column()
  declare invoiceId: string

  @column()
  declare userId: string

  @column()
  declare amount: number

  @column()
  declare method: 'stripe' | 'bank_transfer' | 'cash' | 'check'

  @column()
  declare status: 'pending' | 'completed' | 'failed' | 'cancelled'

  @column()
  declare stripePaymentIntentId: string | null

  @column()
  declare stripeChargeId: string | null

  @column()
  declare notes: string | null

  @belongsTo(() => Invoice)
  declare invoice: BelongsTo<typeof Invoice>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime()
  declare receivedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import Invoice from './invoice.js'
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
  declare method: string

  @belongsTo(() => Invoice)
  declare invoice: BelongsTo<typeof Invoice>

  @column.dateTime()
  declare receivedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

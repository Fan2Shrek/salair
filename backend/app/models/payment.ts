import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Invoice from './invoice.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare invoiceId: number

  @column()
  declare userId: number

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

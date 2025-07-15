import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { v7 } from 'uuid'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Invoice from './invoice.js'

export default class InvoiceItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static generateId(invoiceItem: InvoiceItem) {
    invoiceItem.id = v7()
  }

  @column()
  declare invoiceId: string

  @column()
  declare description: string

  @column()
  declare quantity: number

  @column()
  declare unitPrice: number

  @column()
  declare totalPrice: number

  @column()
  declare vatRate: number

  @column()
  declare vatAmount: number

  @belongsTo(() => Invoice)
  declare invoice: BelongsTo<typeof Invoice>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

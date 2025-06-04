import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Customer from './customer.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import InvoiceItem from './invoice_item.js'
import { v7 } from 'uuid'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static generateId(invoice: Invoice) {
    invoice.id = v7()
  }

  @column()
  declare userId: string

  @column()
  declare customerId: string

  @column()
  declare invoiceNumber: string

  @column.dateTime()
  declare issueDate: DateTime

  @column.dateTime()
  declare dueDate: DateTime

  @column()
  declare status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

  @column()
  declare totalHT: number

  @column()
  declare totalTTC: number

  @column()
  declare notes: string

  @column()
  declare pdfUrl: string

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => InvoiceItem)
  declare invoiceItems: HasMany<typeof InvoiceItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

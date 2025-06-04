import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { v7 } from 'uuid'

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
}

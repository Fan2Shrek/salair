import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { v7 } from 'uuid'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static generateId(customer: Customer) {
    customer.id = v7()
  }

  @column()
  declare userId: string

  @column()
  declare companyName: string

  @column()
  declare contactName: string

  @column()
  declare email: string

  @column()
  declare phoneNumber: string

  @column()
  declare address: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

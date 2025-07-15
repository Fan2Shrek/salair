import { DateTime } from 'luxon'
import { beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Invoice from './invoice.js'
import { v7 } from 'uuid'
import SoftDeletableModel from './base/soft_deletable_model.js'

export default class Customer extends SoftDeletableModel {
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

  @hasMany(() => Invoice)
  declare invoices: HasMany<typeof Invoice>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}

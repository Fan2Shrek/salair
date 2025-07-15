import { DateTime } from 'luxon'
import { beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { v7 } from 'uuid'
import SoftDeletableModel from './base/soft_deletable_model.js'

export default class Company extends SoftDeletableModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static generateId(company: Company) {
    company.id = v7()
  }

  @column()
  declare ownerId: string

  @column()
  declare status: string

  @column()
  declare siret: string

  @column()
  declare activity: string

  @column()
  declare tradeName: string

  @column()
  declare urssafFrequency: string

  @column.dateTime()
  declare businessStartDate: DateTime

  @column()
  declare isVatPayer: boolean

  @column()
  declare defaultVatRate: number

  @column()
  declare billingType: string

  @column()
  declare currency: string

  @column()
  declare defaultDueDays: number

  @column()
  declare logoUrl: string

  @column()
  declare defaultInvoiceNote: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>
}

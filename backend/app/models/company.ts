import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import CompanyUser from './company_user.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare siret: string

  @column()
  declare address: string

  @column()
  declare industry: string

  @column()
  declare legal_form: string

  @hasMany(() => CompanyUser)
  declare companyUsers: HasMany<typeof CompanyUser>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

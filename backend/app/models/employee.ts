import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import CompanyUser from './company_user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Employee extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare companyUserId: number

  @column.dateTime()
  declare birthDate: DateTime

  @column()
  declare socialSecurityNumber: string

  @column()
  declare address: string

  @column()
  declare position: string

  @column()
  declare onboardingComplete: boolean

  @belongsTo(() => CompanyUser)
  declare companyUser: BelongsTo<typeof CompanyUser>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

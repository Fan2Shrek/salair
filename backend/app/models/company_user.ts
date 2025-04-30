import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Company from './company.js'
import Employee from './employee.js'

export default class CompanyUser extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare companyId: number

  @column()
  declare role: 'ceo' | 'hr' | 'employee' | 'accountant'

  @column()
  declare isOwner: boolean

  @column.dateTime({ serializeAs: 'invitation_accepted_at' })
  declare invitationAcceptedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>

  @hasOne(() => Employee)
  declare employee: HasOne<typeof Employee>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

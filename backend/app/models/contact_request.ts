import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ContactRequest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column() declare firstName: string
  @column() declare lastName: string
  @column() declare email: string
  @column() declare phoneNumber: string
  @column() declare message: string
  @column() declare isAgreeingPrivacy: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

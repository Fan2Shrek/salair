import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class InboundMail extends BaseModel {
  @column({ isPrimary: true }) declare id: number

  @column() declare from: string
  @column() declare to: string
  @column() declare subject: string
  @column() declare text: string
  @column() declare html: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

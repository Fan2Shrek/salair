import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { v7 } from 'uuid'

export default class InboundMail extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static generateId(inboudMail: InboundMail) {
    inboudMail.id = v7()
  }

  @column()
  declare from: string

  @column()
  declare to: string

  @column()
  declare subject: string

  @column()
  declare text: string

  @column()
  declare html: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

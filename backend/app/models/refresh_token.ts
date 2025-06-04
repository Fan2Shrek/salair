import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { v7 } from 'uuid'

export default class RefreshToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static generateId(token: RefreshToken) {
    token.id = v7()
  }

  @column()
  declare userId: string

  @column()
  declare token: string

  @column()
  declare isRevoked: boolean

  @column.dateTime()
  declare expiresAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}

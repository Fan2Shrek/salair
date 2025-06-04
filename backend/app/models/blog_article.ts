import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, scope } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { v7 } from 'uuid'

export default class BlogArticle extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static generateId(article: BlogArticle) {
    article.id = v7()
  }

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare slug: string

  @column()
  declare status: 'draft' | 'published' | 'archived'

  @column()
  declare visible: boolean

  @column()
  declare authorId: string

  @column()
  declare mainPicture: string

  @belongsTo(() => User, { foreignKey: 'authorId' })
  declare author: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static published = scope((query) => {
    query.where('status', 'published').where('visible', true)
  })
}

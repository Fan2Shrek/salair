import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, hasOne, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Company from './company.js'
import Customer from './customer.js'
import Invoice from './invoice.js'
import Payment from './payment.js'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import { v7 as randomUUID } from 'uuid'
import { WithSoftDeletes } from './mixins/with_soft_deletes.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, WithSoftDeletes) {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static async generateId(user: User) {
    user.id = randomUUID()
  }

  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 'user' | 'admin'

  @column()
  declare phoneNumber: string | null

  @column()
  declare status: 'active' | 'inactive' | 'suspended'

  @column.dateTime()
  declare lastLoginAt: DateTime

  @column()
  declare currentPlanId: number

  @column()
  declare isOnTrial: boolean

  @column.dateTime()
  declare trialEndsAt: DateTime

  @column()
  declare avatar: string

  @column({ serializeAs: null })
  declare twoFactorSecret: string | null

  @column()
  declare isTwoFactorEnabled: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @hasOne(() => Company, { foreignKey: 'ownerId' })
  declare company: HasOne<typeof Company>

  @hasMany(() => Customer)
  declare customers: HasMany<typeof Customer>

  @hasMany(() => Invoice)
  declare invoices: HasMany<typeof Invoice>

  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}

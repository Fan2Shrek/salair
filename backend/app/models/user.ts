import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, hasOne, scope } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Company from './company.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { v7 as randomUUID } from 'uuid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
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

  static accessTokens = DbAccessTokensProvider.forModel(User)

  /**
   * Soft deletes the model by setting deletedAt to the current time.
   */
  async softDelete(): Promise<void> {
    this.deletedAt = DateTime.now()
    await this.save()
  }

  /**
   * Restores a soft-deleted model by setting deletedAt to null.
   */
  async restore(): Promise<void> {
    this.deletedAt = null
    await this.save()
  }

  /**
   * Check if the current model is soft deleted
   */
  isTrashed(): boolean {
    return this.deletedAt !== null
  }

  /**
   * Override the delete method to use softDelete instead
   */
  async delete(): Promise<void> {
    return this.softDelete()
  }

  /**
   * Force delete the model (hard delete)
   */
  async forceDelete(): Promise<void> {
    return super.delete()
  }

  /**
   * Scope to exclude soft deleted records
   */
  static withoutTrashed = scope((query: any) => {
    query.whereNull('deleted_at')
  })

  /**
   * Scope to include all records
   */
  static withTrashed = scope(() => {
    // Ne fait rien de spécifique pour inclure tous les enregistrements
  })

  /**
   * Scope to only include soft deleted records
   */
  static onlyTrashed = scope((query: any) => {
    query.whereNotNull('deleted_at')
  })
}

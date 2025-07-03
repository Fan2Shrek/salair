import { DateTime } from 'luxon'
import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { BaseModel, column, scope } from '@adonisjs/lucid/orm'

/**
 * Mixin qui ajoute les fonctionnalités de soft delete à un modèle
 */
export const WithSoftDeletes = <T extends NormalizeConstructor<typeof BaseModel>>(
  superclass: T
) => {
  class SoftDeletableClass extends superclass {
    @column.dateTime()
    declare deletedAt: DateTime | null

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
     * Without soft deleted entries
     */
    static withoutTrashed = scope((query) => {
      query.whereNull('deleted_at')
    })

    static withTrashed = scope(() => {
      // Ne fait rien de spécifique pour inclure tous les enregistrements
    })

    static onlyTrashed = scope((query) => {
      query.whereNotNull('deleted_at')
    })
  }

  return SoftDeletableClass
}

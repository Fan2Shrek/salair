import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

/**
 * Base model for implementing soft delete functionality
 */
export default abstract class SoftDeletableModel extends BaseModel {
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
}

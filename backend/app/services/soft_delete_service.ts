/**
 * Service providing methods for handling soft-deleted records
 */
export class SoftDeleteService {
  /**
   * Force deletes a soft-deleted record (permanently removes it from the database)
   */
  async forceDelete(model: any): Promise<void> {
    await model.forceDelete()
  }

  /**
   * Restores a soft-deleted record
   */
  async restore(model: any): Promise<void> {
    await model.restore()
  }

  /**
   * Find soft deleted records
   */
  async findSoftDeleted(modelClass: any): Promise<any[]> {
    return await modelClass.query().whereNotNull('deleted_at').exec()
  }

  /**
   * Find a record including soft deleted ones
   */
  async findWithTrashed(modelClass: any, id: string): Promise<any | null> {
    // Trouve un enregistrement par ID, qu'il soit supprimé ou non
    return await modelClass.query().where('id', id).exec()
  }

  /**
   * Find only trashed records
   */
  async findOnlyTrashed(modelClass: any, id: string): Promise<any | null> {
    return await modelClass.query().whereNotNull('deleted_at').where('id', id).first()
  }
}

export default new SoftDeleteService()

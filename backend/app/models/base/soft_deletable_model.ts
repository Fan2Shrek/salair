import { BaseModel } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { WithSoftDeletes } from '../mixins/with_soft_deletes.js'

/**
 * Classe de base pour les modèles avec soft delete
 *
 * Cette classe étend BaseModel et inclut le mixin WithSoftDeletes.
 * Utilisez cette classe pour les modèles qui n'ont pas besoin d'autres mixins.
 * Pour les modèles qui nécessitent d'autres mixins, utilisez directement compose avec WithSoftDeletes.
 */
export default abstract class SoftDeletableModel extends compose(BaseModel, WithSoftDeletes) {}

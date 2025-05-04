import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('slug').notNullable()
      table.text('description').notNullable()
      table.integer('price_cents').notNullable()
      table.string('currency').notNullable()
      table.enum('billing_cycle', ['monthly', 'yearly']).notNullable()
      table.boolean('is_popular').notNullable().defaultTo(false)
      table.jsonb('features').notNullable()
      table.string('stripe_price_id').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

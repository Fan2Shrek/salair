import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users').notNullable()
      table.integer('plan_id').references('id').inTable('plans').notNullable()
      table.string('stripe_subscription_id').notNullable()
      table.enum('status', ['active', 'trialing', 'canceled', 'past_due']).notNullable()
      table.timestamp('started_at').notNullable()
      table.timestamp('ends_at').nullable()
      table.timestamp('canceled_at').nullable()
      table.boolean('is_trial').notNullable().defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

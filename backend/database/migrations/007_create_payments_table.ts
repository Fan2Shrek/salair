import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('invoice_id')
        .references('id')
        .inTable('invoices')
        .onDelete('CASCADE')
        .notNullable()
      table.uuid('user_id').references('id').inTable('users').notNullable()
      table.decimal('amount', 10, 2).notNullable()
      table.enum('method', ['stripe', 'bank_transfer', 'cash', 'check']).notNullable()
      table.enum('status', ['pending', 'completed', 'failed', 'cancelled']).defaultTo('pending')
      table.string('stripe_payment_intent_id').nullable()
      table.string('stripe_charge_id').nullable()
      table.text('notes').nullable()
      table.timestamp('received_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Indexes
      table.index('invoice_id')
      table.index('user_id')
      table.index('status')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

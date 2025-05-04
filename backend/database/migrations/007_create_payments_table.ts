import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('invoice_id').notNullable().references('id').inTable('invoices')
      table.integer('user_id').notNullable().references('id').inTable('users')
      table.decimal('amount').notNullable()
      table.string('method').notNullable()
      table.timestamp('received_at').notNullable()
      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

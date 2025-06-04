import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'invoices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()
      table.uuid('user_id').notNullable().references('id').inTable('users')
      table.uuid('customer_id').notNullable().references('id').inTable('customers')
      table.string('invoice_number').notNullable()
      table.timestamp('issue_date').notNullable()
      table.timestamp('due_date').notNullable()
      table.decimal('total_ht').notNullable()
      table.decimal('total_ttc').notNullable()
      table.text('notes').nullable()
      table.string('pdf_url').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

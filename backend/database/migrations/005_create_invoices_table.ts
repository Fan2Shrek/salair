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
      table.enum('status', ['draft', 'sent', 'paid', 'overdue', 'cancelled']).defaultTo('draft')
      table.decimal('total_ht', 10, 2).notNullable()
      table.decimal('total_ttc', 10, 2).notNullable()
      table.text('notes').nullable()
      table.string('pdf_url').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('deleted_at').nullable()
      table.timestamp('updated_at').nullable()

      // Indexes
      table.index('user_id')
      table.index('customer_id')
      table.index('status')
      table.unique(['user_id', 'invoice_number'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

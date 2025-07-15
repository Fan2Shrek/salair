import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'invoice_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('invoice_id')
        .references('id')
        .inTable('invoices')
        .onDelete('CASCADE')
        .notNullable()
      table.string('description').notNullable()
      table.decimal('quantity', 8, 2).notNullable().defaultTo(1)
      table.decimal('unit_price', 10, 2).notNullable()
      table.decimal('total_price', 10, 2).notNullable()
      table.decimal('vat_rate', 5, 2).notNullable().defaultTo(0)
      table.decimal('vat_amount', 10, 2).notNullable().defaultTo(0)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Indexes
      table.index('invoice_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'invoice_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('invoice_id').references('id').inTable('invoices').notNullable()
      table.string('description').notNullable()
      table.decimal('unit_price').notNullable()
      table.decimal('total_price').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

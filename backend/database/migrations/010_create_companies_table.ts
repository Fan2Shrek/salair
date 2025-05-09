import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('owner_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.string('status').notNullable()
      table.string('siret').nullable()
      table.string('activity').nullable()
      table.string('trade_name').nullable()

      table.string('urssaf_frequency').nullable()
      table.date('business_start_date').nullable()
      table.boolean('is_vat_payer').defaultTo(false)

      table.string('billing_type').nullable()
      table.string('currency').defaultTo('EUR')
      table.integer('default_due_days').defaultTo(0)
      table.string('logo_url').nullable()
      table.text('default_invoice_note').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

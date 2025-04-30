import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employees'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('company_user_id')
        .nullable()
        .references('id')
        .inTable('company_users')
        .onDelete('CASCADE')
      table.timestamp('birth_date').notNullable()
      table.string('social_security_number').notNullable()
      table.string('address').notNullable()
      table.string('position').notNullable()
      table.boolean('onboarding_complete').defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

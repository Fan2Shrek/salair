import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'blog_articles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.string('slug').notNullable()
      table.enum('status', ['draft', 'published', 'archived']).notNullable()
      table.boolean('visible').notNullable().defaultTo(false)
      table.uuid('author_id').notNullable().references('id').inTable('users')
      table.string('main_picture').nullable()

      table.timestamp('deleted_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

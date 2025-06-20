import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Add deleted_at column to users table
    this.schema.alterTable('users', (table) => {
      table.timestamp('deleted_at').nullable()
    })

    // Add deleted_at column to companies table
    this.schema.alterTable('companies', (table) => {
      table.timestamp('deleted_at').nullable()
    })

    // Add deleted_at column to blog_articles table
    this.schema.alterTable('blog_articles', (table) => {
      table.timestamp('deleted_at').nullable()
    })

    // Add deleted_at column to customers table
    this.schema.alterTable('customers', (table) => {
      table.timestamp('deleted_at').nullable()
    })

    // Add deleted_at column to invoices table
    this.schema.alterTable('invoices', (table) => {
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    // Remove deleted_at column from users table
    this.schema.alterTable('users', (table) => {
      table.dropColumn('deleted_at')
    })

    // Remove deleted_at column from companies table
    this.schema.alterTable('companies', (table) => {
      table.dropColumn('deleted_at')
    })

    // Remove deleted_at column from blog_articles table
    this.schema.alterTable('blog_articles', (table) => {
      table.dropColumn('deleted_at')
    })

    // Remove deleted_at column from customers table
    this.schema.alterTable('customers', (table) => {
      table.dropColumn('deleted_at')
    })

    // Remove deleted_at column from invoices table
    this.schema.alterTable('invoices', (table) => {
      table.dropColumn('deleted_at')
    })
  }
}

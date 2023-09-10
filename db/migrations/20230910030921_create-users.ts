import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('nome').notNullable()
    table.integer('idade').notNullable()
    table.decimal('peso', 10, 2).notNullable()
    table.decimal('altura', 10, 2).notNullable()
    table.timestamp('updated_at')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'produtos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.string('nome').notNullable()
      table.string('tipo').nullable()
      table.string('animal').notNullable()
      table.integer('peso_saco').notNullable()
      table.integer('quantidade').notNullable()
      table.decimal('preco_pix', 10, 2).notNullable()
      table.decimal('preco_cartao', 10, 2).nullable()
      table.string('imagem').nullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

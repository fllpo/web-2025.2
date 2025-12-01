import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pedido_itens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('pedido_id').notNullable().references('id').inTable('pedidos').onDelete('CASCADE')
      table
        .uuid('produto_id')
        .notNullable()
        .references('id')
        .inTable('produtos')
        .onDelete('RESTRICT')

      // Snapshot dos dados do produto no momento da compra
      table.string('produto_nome').notNullable()
      table.decimal('preco_unitario', 10, 2).notNullable()
      table.integer('quantidade').notNullable()
      table.decimal('subtotal', 10, 2).notNullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

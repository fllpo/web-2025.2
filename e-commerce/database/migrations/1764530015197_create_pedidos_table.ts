import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pedidos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table
        .uuid('usuario_id')
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')

      // Informações do pedido
      table.decimal('subtotal', 10, 2).notNullable()
      table.decimal('frete', 10, 2).notNullable().defaultTo(0)
      table.decimal('total', 10, 2).notNullable()

      // Status do pedido
      table
        .enum('status', ['pendente', 'em_separacao', 'em_transito', 'entregue', 'cancelado'])
        .defaultTo('pendente')

      // Endereço de entrega (snapshot do endereço do usuário no momento da compra)
      table.string('endereco_cep').notNullable()
      table.string('endereco_logradouro').notNullable()
      table.string('endereco_numero').notNullable()
      table.string('endereco_bairro').notNullable()
      table.string('endereco_cidade').notNullable()
      table.string('endereco_estado', 2).notNullable()
      table.string('endereco_complemento').nullable()

      // Observações
      table.text('observacoes').nullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

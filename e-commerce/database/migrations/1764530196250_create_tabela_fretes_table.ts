import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tabela_frete'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      // Faixa de CEP (ex: 26000-000 até 26999-999)
      table.string('cep_inicio', 9).notNullable()
      table.string('cep_fim', 9).notNullable()

      // Ou cidade/estado
      table.string('cidade').nullable()
      table.string('estado', 2).nullable()

      // Valor do frete
      table.decimal('valor', 10, 2).notNullable()

      // Prazo de entrega em dias
      table.integer('prazo_dias').notNullable().defaultTo(3)

      table.boolean('ativo').defaultTo(true)

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

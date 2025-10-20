import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.string('nome', 255).notNullable()
      table.string('telefone', 15).notNullable()
      table.string('cep', 10).notNullable()
      table.string('logradouro', 500).notNullable()
      table.integer('numero').notNullable()
      table.string('cidade', 100).notNullable()
      table.string('estado', 100).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('senha', 180).notNullable()
      table.string('bairro', 100).notNullable()
      table.boolean('is_admin').defaultTo(false)
      table.string('foto_perfil', 255).nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

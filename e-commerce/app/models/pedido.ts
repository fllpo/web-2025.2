import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import PedidoItem from './pedido_item.js'

export default class Pedido extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare usuarioId: string

  @column()
  declare subtotal: number

  @column()
  declare frete: number

  @column()
  declare total: number

  @column()
  declare status: 'pendente' | 'em_separacao' | 'em_transito' | 'entregue' | 'cancelado'

  @column()
  declare enderecoCep: string

  @column()
  declare enderecoLogradouro: string

  @column()
  declare enderecoNumero: string

  @column()
  declare enderecoBairro: string

  @column()
  declare enderecoCidade: string

  @column()
  declare enderecoEstado: string

  @column()
  declare enderecoComplemento: string | null

  @column()
  declare observacoes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => PedidoItem)
  declare itens: HasMany<typeof PedidoItem>
}

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Pedido from './pedido.js'
import Produto from './produto.js'

export default class PedidoItem extends BaseModel {
  static table = 'pedido_itens'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare pedidoId: string

  @column()
  declare produtoId: string

  @column()
  declare produtoNome: string

  @column()
  declare precoUnitario: number

  @column()
  declare quantidade: number

  @column()
  declare subtotal: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Pedido)
  declare pedido: BelongsTo<typeof Pedido>

  @belongsTo(() => Produto)
  declare produto: BelongsTo<typeof Produto>
}

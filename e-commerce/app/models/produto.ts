import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Produto extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nome: string

  @column()
  declare tipo: string

  @column()
  declare animal: string

  @column()
  declare peso_saco: number

  @column()
  declare quantidade: number

  @column()
  declare preco_pix: number

  @column()
  declare preco_cartao: number

  @column()
  declare imagem: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

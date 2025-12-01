import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TabelaFrete extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare cepInicio: string

  @column()
  declare cepFim: string

  @column()
  declare cidade: string | null

  @column()
  declare estado: string | null

  @column()
  declare valor: number

  @column()
  declare prazoDias: number

  @column()
  declare ativo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

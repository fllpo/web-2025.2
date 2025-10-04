import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Usuario extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare telefone: string

  @column()
  declare cep: string

  @column()
  declare logradouro: string

  @column()
  declare numero: number

  @column()
  declare cidade: string
  @column()
  declare estado: string

  @column()
  declare email: string

  @column()
  declare senha: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

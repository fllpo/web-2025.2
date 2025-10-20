import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'senha',
})

export default class Usuario extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

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

  @column({ serializeAs: null })
  declare senha: string

  @column()
  declare bairro: string

  @column()
  declare isAdmin: boolean

  @column()
  declare fotoPerfil: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

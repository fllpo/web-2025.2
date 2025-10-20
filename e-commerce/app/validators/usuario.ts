import vine from '@vinejs/vine'

export const criarUsuarioValidator = vine.compile(
  vine.object({
    nome: vine.string().minLength(3).maxLength(100),
    telefone: vine.string().minLength(10).maxLength(15),
    cep: vine.string().minLength(8).maxLength(9),
    logradouro: vine.string().minLength(3).maxLength(100),
    numero: vine.number().min(1),
    cidade: vine.string().minLength(2).maxLength(100),
    bairro: vine.string().minLength(2).maxLength(100),
    estado: vine.string().minLength(2).maxLength(2),
    email: vine.string().email(),
    senha: vine.string().minLength(6).maxLength(100),
  })
)

export const loginUsuarioValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    senha: vine.string().minLength(6).maxLength(100),
  })
)

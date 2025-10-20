import vine from '@vinejs/vine'

export const criarProdutoValidator = vine.compile(
  vine.object({
    nome: vine.string().minLength(3).maxLength(100),
    tipo: vine.string().minLength(3).maxLength(50),
    animal: vine.enum(['Cachorro', 'Gato', 'Galinha', 'Coelho']),
    peso_saco: vine.number().positive().min(0.1),
    quantidade: vine.number().positive().min(0),
    preco_pix: vine.number().positive(),
  })
)

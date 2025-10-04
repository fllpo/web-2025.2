import Usuario from '#models/usuario'

export class UsuarioService {
  async criar(dados: {
    nome: string
    telefone: string
    cep: string
    logradouro: string
    numero: number
    cidade: string
    estado: string
    email: string
    senha: string
  }) {
    return Usuario.create({
      nome: dados.nome,
      telefone: dados.telefone,
      cep: dados.cep,
      logradouro: dados.logradouro,
      numero: dados.numero,
      cidade: dados.cidade,
      estado: dados.estado,
      email: dados.email,
      senha: dados.senha,
    })
  }

  async atualizar(
    id: number,
    dados: {
      telefone?: string
      cep?: string
      logradouro?: string
      numero?: number
      cidade?: string
      estado?: string
      senha?: string
    }
  ) {
    const usuario = await Usuario.find(id)

    if (!usuario) {
      return null
    }

    usuario.merge(dados)
    await usuario.save()

    return usuario
  }
  // TODO
  async validarDados(dados: {
    nome: string
    telefone: string
    cep: string
    logradouro: string
    numero: number
    cidade: string
    estado: string
    email: string
    senha: string
  }) {
    const erros = []

    if (!dados.nome || dados.nome.trim().length < 2) {
      erros.push('Nome deve ter pelo menos 2 caracteres')
    }
    return erros
  }
}

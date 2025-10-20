import Usuario from '#models/usuario'
import hash from '@adonisjs/core/services/hash'
export class UsuarioService {
  async buscarPorEmail(email: string) {
    return Usuario.findBy('email', email)
  }

  async verificarSenha(senhaPlain: string, senhaHash: string) {
    return hash.verify(senhaPlain, senhaHash)
  }

  async criar(dados: {
    nome: string
    telefone: string
    cep: string
    logradouro: string
    numero: number
    cidade: string
    estado: string
    bairro: string
    email: string
    senha: string
  }) {
    const senhaHash = await hash.make(dados.senha)
    return Usuario.create({
      nome: dados.nome,
      telefone: dados.telefone,
      cep: dados.cep,
      logradouro: dados.logradouro,
      numero: dados.numero,
      cidade: dados.cidade,
      estado: dados.estado,
      bairro: dados.bairro,
      email: dados.email,
      senha: senhaHash,
    })
  }
}

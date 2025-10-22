import Usuario from '#models/usuario'

export class UsuarioService {
  async buscarPorEmail(email: string) {
    return Usuario.findBy('email', email)
  }

  async criar(dados: any) {
    return Usuario.create(dados)
  }
}

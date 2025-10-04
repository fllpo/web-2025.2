import type { HttpContext } from '@adonisjs/core/http'
import { UsuarioService } from '#services/usuario_service'

export default class UsuariosController {
  private usuarioService = new UsuarioService()

  //Formulário Login
  async login({ view }: HttpContext) {
    return view.render('pages/usuario/login')
  }

  // Formulário Cadastro
  async signin({ view }: HttpContext) {
    return view.render('pages/usuario/cadastrar')
  }

  // Cria um novo usuário
  // TODO
  async store({ request, response }: HttpContext) {
    const dados = request.only(['email', 'senha'])
    console.log(dados)

    response.redirect().toRoute('produto.listar')
  }
}

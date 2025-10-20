import type { HttpContext } from '@adonisjs/core/http'
import { UsuarioService } from '#services/usuario_service'
import { criarUsuarioValidator, loginUsuarioValidator } from '#validators/usuario'

export default class UsuariosController {
  private usuarioService = new UsuarioService()

  async login({ view }: HttpContext) {
    return view.render('pages/usuario/login')
  }

  async signin({ view }: HttpContext) {
    return view.render('pages/usuario/cadastrar')
  }

  async store({ request, response }: HttpContext) {
    try {
      const dados = await request.validateUsing(criarUsuarioValidator)

      const usuarioExistente = await this.usuarioService.buscarPorEmail(dados.email)
      if (usuarioExistente) {
        return response.badRequest('Email já cadastrado.')
      }

      await this.usuarioService.criar(dados)
      return response.redirect().toRoute('usuario.login')
    } catch (error) {
      if (error.messages) {
        console.error(error)
        return response.badRequest('Erro ao criar usuário.')
      }
      console.error(error)
    }
    return response.internalServerError('Erro no servidor.')
  }

  async authenticate({ request, response, auth }: HttpContext) {
    try {
      const dados = await request.validateUsing(loginUsuarioValidator)

      const usuario = await this.usuarioService.buscarPorEmail(dados.email)
      if (!usuario) {
        return response.unauthorized('Credenciais inválidas. E-mail')
      }
      const senhaValida = await this.usuarioService.verificarSenha(dados.senha, usuario.senha)
      if (!senhaValida) {
        return response.unauthorized('Credenciais inválidas. Senha')
      }

      await auth.use('web').login(usuario)

      return response.redirect().toRoute('produto.listar')
    } catch (error) {
      if (error.messages) {
        return response.badRequest('Erro ao autenticar usuário.')
      }
      console.error(error)
    }
    return response.internalServerError('Erro no servidor.')
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('usuario.login')
  }
}

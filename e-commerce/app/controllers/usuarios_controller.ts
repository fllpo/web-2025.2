import type { HttpContext } from '@adonisjs/core/http'
import { UsuarioService } from '#services/usuario_service'
import { criarUsuarioValidator } from '#validators/usuario'

export default class UsuariosController {
  private usuarioService = new UsuarioService()

  async signin({ view }: HttpContext) {
    return view.render('pages/usuario/cadastrar')
  }

  async store({ request, response }: HttpContext) {
    try {
      const dados = await request.validateUsing(criarUsuarioValidator)

      console.log('🔴 DADOS RECEBIDOS NO CONTROLLER:')
      console.log('Email:', dados.email)
      console.log('Senha:', dados.senha)
      console.log('Tamanho senha:', dados.senha.length)
      console.log('Começa com $scrypt?', dados.senha.startsWith('$scrypt'))

      const usuarioExistente = await this.usuarioService.buscarPorEmail(dados.email)

      if (usuarioExistente) {
        return response.badRequest('Usuário já cadastrado.')
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
}

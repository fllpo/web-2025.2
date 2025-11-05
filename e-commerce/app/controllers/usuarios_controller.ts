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

      const imagem = request.file('imagem', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (imagem && !imagem.isValid)
        return response.status(422).json({
          status: 'error',
          message: 'Arquivo inválido',
          erros: imagem.errors,
        })

      let nomeImagem
      try {
        nomeImagem = await this.usuarioService.salvarImagem(imagem)
      } catch (error) {
        return response.status(500).json({
          status: 'error',
          message: 'Erro ao fazer upload da imagem',
        })
      }

      const usuarioExistente = await this.usuarioService.buscarPorEmail(dados.email)

      if (usuarioExistente) {
        return response.badRequest('Usuário já cadastrado.')
      }

      await this.usuarioService.criar({
        nome: dados.nome,
        telefone: dados.telefone,
        cep: dados.cep,
        logradouro: dados.logradouro,
        numero: dados.numero,
        cidade: dados.cidade,
        estado: dados.estado,
        email: dados.email,
        senha: dados.senha,
        bairro: dados.bairro,
        fotoPerfil: nomeImagem || undefined,
      })
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

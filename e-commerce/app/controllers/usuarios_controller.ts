import type { HttpContext } from '@adonisjs/core/http'
import { UsuarioService } from '#services/usuario_service'
import { criarUsuarioValidator } from '#validators/usuario'

export default class UsuariosController {
  private usuarioService = new UsuarioService()

  async signin({ view }: HttpContext) {
    return view.render('pages/usuario/cadastrar')
  }

  async store({ request, response, session }: HttpContext) {
    try {
      const dados = await request.validateUsing(criarUsuarioValidator)

      const imagem = request.file('imagem', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (imagem && !imagem.isValid){
        session.flash('error', `Imagem inválida: ${imagem.errors[0].message}`)
        return response.redirect().back()
      }
        

      let nomeImagem
      try {
        nomeImagem = await this.usuarioService.salvarImagem(imagem)
      } catch (error) {
        console.error(error)
        session.flash('error', 'Erro ao salvar a imagem. Tente novamente.')
        return response.redirect().back()
      }

      const usuarioExistente = await this.usuarioService.buscarPorEmail(dados.email)

      if (usuarioExistente) {
        session.flash('error', 'Este e-mail já está cadastrado.')
        return response.redirect().back()
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
      session.flash('success', 'Cadastro realizado com sucesso! Faça login.')
      return response.redirect().toRoute('usuario.login')

    } catch (error) {
      console.error(error)
      session.flash('error', 'Ocorreu um erro interno. Tente novamente mais tarde.')
      return response.redirect().back()
    }
  }
}

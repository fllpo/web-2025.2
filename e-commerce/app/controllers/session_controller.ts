import Usuario from '#models/usuario'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ view }: HttpContext) {
    return view.render('pages/usuario/login')
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { email, senha } = request.only(['email', 'senha'])

    try {
      const usuario = await Usuario.verifyCredentials(email, senha)
      await auth.use('web').login(usuario)
      response.redirect().toRoute('produto.listar')
    } catch (error) {
      session.flash('error', 'Email ou senha inválidos.')
      response.redirect().back()
    }
  }

  async destroy({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Você saiu do sistema com segurança.')
    response.redirect().toRoute('usuario.login')
  }
}

import Usuario from '#models/usuario'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ view }: HttpContext) {
    return view.render('pages/usuario/login')
  }

  async store({ request, auth, response }: HttpContext) {
    const { email, senha } = request.only(['email', 'senha'])

    try {
      const usuario = await Usuario.verifyCredentials(email, senha)
      await auth.use('web').login(usuario)
      response.redirect().toRoute('produto.listar')
    } catch (error) {
      return response.unauthorized('Credenciais inválidas.')
    }
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().toRoute('usuario.login')
  }
}

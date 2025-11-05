import type { HttpContext } from '@adonisjs/core/http'
import { UsuarioService } from '#services/usuario_service'
import { inject } from '@adonisjs/core'
import app from '@adonisjs/core/services/app' // 1. Importe 'app'
import { cuid } from '@adonisjs/core/helpers'

@inject()
export default class PerfilsController {
  constructor(protected usuarioService: UsuarioService) {}

  public async show({ auth, view }: HttpContext) {
    const usuario = auth.user
    return view.render('pages/profile/show', { usuario })
  }

  public async edit({ auth, view }: HttpContext) {
    const usuario = auth.user
    return view.render('pages/profile/edit', { usuario })
  }
  public async update({ auth, request, response, session }: HttpContext) {
    const usuarioId = auth.user!.id

    const data = request.only([
      'nome',
      'email',
      'telefone',
      'logradouro',
      'numero',
      'bairro',
      'cidade',
      'estado',
      'cep',
    ])

    const dadosParaAtualizar: any = data

    const foto = request.file('foto_perfil', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })

    if (foto && foto.isValid) {
      const novoNome = `${cuid()}.${foto.extname}`

      await foto.move(app.makePath('resources/images/uploads/usuarios'), {
        name: novoNome,
      })

      dadosParaAtualizar.fotoPerfil = novoNome
    } else if (foto && !foto.isValid) {
      session.flash('error', `Erro no upload: ${foto.errors[0].message}`)
      return response.redirect().back()
    }

    try {
      await this.usuarioService.atualizar(usuarioId, dadosParaAtualizar)

      session.flash('success', 'Perfil atualizado com sucesso!')
      return response.redirect().toRoute('profile.show')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Ocorreu um erro ao atualizar o perfil.')
      return response.redirect().back()
    }
  }
}

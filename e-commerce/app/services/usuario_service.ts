import Usuario from '#models/usuario'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import path from 'node:path'
import sharp from 'sharp'

export class UsuarioService {
  async buscarPorEmail(email: string) {
    return Usuario.findBy('email', email)
  }

  async salvarImagem(arquivo: any) {
    if (!arquivo) {
      return null
    }

    try {
      const novoNome = `${cuid()}.webp`
      const caminho = path.join(app.makePath('resources/images/uploads/usuario'), novoNome)

      await sharp(arquivo.tmpPath!)
        .resize(800, 800, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .webp({ quality: 85 })
        .toFile(caminho)

      return novoNome
    } catch (error) {
      console.log('Erro ao salvar a imagem', error)
      throw new Error('Erro ao fazer upload da imagem')
    }
  }

  async criar(dados: any) {
    return Usuario.create(dados)
  }

  async atualizar(
    id: string,
    dados: {
      nome?: string
      telefone?: string
      cep?: string
      logradouro?: string
      numero?: number
      cidade?: string
      estado?: string
      email?: string
      senha?: string
      bairro?: string
      fotoPerfil?: string
    }
  ) {
    // const produto = await Produto.find(id)
    const usuario = await Usuario.find(id)

    if (!usuario) {
      return null
    }

    usuario.merge(dados)
    await usuario.save()

    return usuario
  }
}

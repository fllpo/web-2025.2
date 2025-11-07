import Produto from '#models/produto'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import path from 'node:path'
import fs from 'node:fs/promises'
import sharp from 'sharp'

export class ProdutoService {
  async listarTodos() {
    return await Produto.all()
  }

  async listarPaginado(pagina: number, limite: number) {
    return await Produto.query().paginate(pagina, limite)
  }

  async buscarPorID(id: string) {
    return await Produto.find(id)
  }

  async buscarPorNome(nome: string) {
    return await Produto.query().where('nome', 'ILIKE', `%${nome}%`).exec()
  }

  async salvarImagem(arquivo: any) {
    if (!arquivo) {
      return null
    }

    try {
      const novoNome = `${cuid()}.webp`
      const caminho = path.join(app.makePath('resources/images/uploads/produtos'), novoNome)

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

  async substituirImagemProduto(imagemAntiga: string, novoArquivo: any): Promise<string | null> {
    if (imagemAntiga) {
      await this.deletarImagemProduto(imagemAntiga)
    }

    return await this.salvarImagem(novoArquivo)
  }

  async deletarProduto(id: string) {
    const produto = await Produto.find(id)

    if (!produto) {
      return false
    }

    if (produto.imagem) {
      await this.deletarImagemProduto(produto.imagem)
    }

    await produto.delete()
    return true
  }

  private async deletarImagemProduto(nomeArquivo: string): Promise<void> {
    try {
      const caminhoImagem = path.join(
        app.makePath('resources/images/uploads/produtos'),
        nomeArquivo
      )
      await fs.unlink(caminhoImagem)
    } catch (error) {
      console.error(`Erro ao deletar imagem ${nomeArquivo}:`, error)
    }
  }

  async criar(dados: {
    nome: string
    tipo?: string
    animal: string
    peso_saco: number
    quantidade: number
    preco_pix: number
    //preco_cartao: number
    imagem?: string
  }) {
    return await Produto.create({
      nome: dados.nome,
      preco_pix: dados.preco_pix,
      //preco_cartao: dados.preco_cartao,
      quantidade: dados.quantidade,
      tipo: dados.tipo,
      animal: dados.animal,
      peso_saco: dados.peso_saco,
      imagem: dados.imagem || 'https://placehold.co/150',
    })
  }

  async atualizar(
    id: string,
    dados: {
      nome?: string
      tipo?: string
      animal?: string
      peso_saco?: number
      quantidade?: number
      preco_pix?: number
      //preco_cartao?: number
      imagem?: string
    }
  ) {
    const produto = await Produto.find(id)

    if (!produto) {
      return null
    }

    produto.merge(dados)
    await produto.save()

    return produto
  }
}

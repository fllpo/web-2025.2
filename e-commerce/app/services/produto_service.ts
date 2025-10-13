import Produto from '#models/produto'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import path from 'node:path'
import fs from 'node:fs/promises'

export class ProdutoService {
  async listarTodos() {
    return await Produto.all()
  }

  async listarPaginado(pagina: number = 1, limite: number = 8) {
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
      const novoNome = `${cuid()}.${arquivo.extname}`
      await arquivo.move(app.makePath('resources/images/uploads/produtos'), {
        name: novoNome,
      })
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

  // TODO
  /*
  validarDados(dados: {
    nome: string
    preco_pix: number
    //preco_cartao: number
    quantidade: number
  }) {
    const erros = []

    if (!dados.nome || dados.nome.trim().length < 2) {
      erros.push('Nome deve ter pelo menos 2 caracteres')
    }

    if (!dados.preco_pix || dados.preco_pix <= 0) {
      erros.push('Preço deve ser maior que zero')
    }

    if (!dados.quantidade || dados.quantidade <= 0) {
      erros.push('Quantidade deve ser maior que zero')
    }

    return erros
  }
  */
}

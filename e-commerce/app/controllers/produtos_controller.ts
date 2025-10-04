import type { HttpContext } from '@adonisjs/core/http'
import { ProdutoService } from '#services/produto_service'

export default class ProdutosController {
  private produtoService = new ProdutoService()

  //Lista todos os produtos
  async index({ view }: HttpContext) {
    try {
      const produtos = await this.produtoService.listarTodos()
      console.log('Produtos encontrados:', produtos.length) // Debug

      return view.render('pages/produtos/produtos', {
        produtos: produtos || [],
      })
    } catch (error) {
      console.error('Erro no controller:', error)
      // Renderiza a página mesmo com erro, mas com array vazio
      return view.render('pages/produtos/produtos', {
        produtos: [],
      })
    }
  }

  // Formulário Criação
  async create({ view }: HttpContext) {
    return view.render('pages/produtos/criar_produto')
  }

  // Cria um novo produto
  async store({ request, response, session }: HttpContext) {
    try {
      const dados = request.only(['nome', 'descricao', 'preco', 'imagem', 'quantidade'])

      const erros = this.produtoService.validarDados(dados)

      if (erros.length > 0) {
        session.flash('errors', erros)
        return response.redirect().back()
      }

      await this.produtoService.criar({
        nome: dados.nome,
        descricao: dados.descricao,
        preco: Number(dados.preco),
        imagem: dados.imagem,
        quantidade: Number(dados.quantidade),
      })

      session.flash('success', 'Produto criado com sucesso!')
      return response.redirect().toRoute('produtos.listar')
    } catch (error) {
      session.flash('error', 'Erro ao criar produto')
      return response.redirect().back()
    }
  }

  // Mostra um produto específico
  async show({ params, view, response }: HttpContext) {
    try {
      const produto = await this.produtoService.buscaPorID(Number(params.id))

      if (!produto) {
        return view.render('pages/errors/not_found', { message: 'Produto não encontrado' })
      }
      return view.render('pages/produtos/produto', { produto })
    } catch (error) {
      return response.redirect().toRoute('produtos.listar')
    }
  }
  // TODO
  async edit({ params, view, response }: HttpContext) {
    try {
      const produto = await this.produtoService.buscaPorID(Number(params.id))

      if (!produto) {
        return view.render('pages/errors/not_found', { message: 'Produto não encontrado' })
      }
      return view.render('pages/produtos/editar_produto', { produto })
    } catch (error) {
      return view.render('pages/errors/server_error', {
        message: 'Erro ao carregar produto',
      })
    }
  }

  //Atualiza um produto
  async update({ params, request, response, session }: HttpContext) {
    try {
      const dados = request.only(['nome', 'descricao', 'preco', 'imagem'])

      const produto = await this.produtoService.atualizar(Number(params.id), {
        nome: dados.nome,
        descricao: dados.descricao,
        preco: dados.preco,
        imagem: dados.imagem,
      })

      if (!produto) {
        session.flash('error', 'Produto não encontrado')
        return response.redirect().back()
      }

      session.flash('success', 'Produto atualizado com sucesso!')
      response.redirect().toRoute('produto.detalhe', { id: params.id })
    } catch (error) {
      session.flash('error', 'Erro ao atualizar produto')
      response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    try {
      const deletado = await this.produtoService.deletar(Number(params.id))
      if (!deletado) {
        session.flash('error', 'Produto não encontrado')
      } else {
        session.flash('success', 'Produto deletado com sucesso')
      }

      return response.redirect().toRoute('produtos.listar')
    } catch (error) {
      session.flash('erro', 'Erro ao deletar produto')
      return response.redirect().back()
    }
  }
}

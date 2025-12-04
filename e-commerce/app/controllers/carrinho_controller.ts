import type { HttpContext } from '@adonisjs/core/http'
import { CarrinhoService } from '#services/carrinho_service'

export default class CarrinhoController {
  private carrinhoService = new CarrinhoService()

  // Ver carrinho
  async index({ view, session }: HttpContext) {
    const carrinho = this.carrinhoService.obterCarrinho(session)
    const total = this.carrinhoService.calcularTotal(carrinho)
    const totalItens = this.carrinhoService.contarItens(carrinho)

    return view.render('pages/carrinho/index', {
      carrinho,
      total,
      totalItens,
    })
  }

  // Obter total de itens
  async total({ session, response }: HttpContext) {
    try {
      const carrinho = this.carrinhoService.obterCarrinho(session)
      const totalItens = this.carrinhoService.contarItens(carrinho)

      return response.json({ total: totalItens })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Erro ao obter total do carrinho',
      })
    }
  }

  // Adicionar produto ao carrinho ok
  async adicionar({ request, response, session }: HttpContext) {
    try {
      const { produtoId, quantidade } = request.only(['produtoId', 'quantidade'])

      await this.carrinhoService.adicionar(session, produtoId, Number(quantidade) || 1)

      return response.status(200).json({
        status: 'success',
        message: 'Produto adicionado ao carrinho',
      })
    } catch (error: any) {
      console.error(error)
      return response.status(400).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  // Atualizar quantidade
  async atualizar({ params, request, response, session }: HttpContext) {
    try {
      const quantidade = request.input('quantidade')

      await this.carrinhoService.atualizarQuantidade(session, params.produto_id, Number(quantidade))

      return response.status(200).json({
        status: 'success',
        message: 'Quantidade atualizada',
      })
    } catch (error: any) {
      console.error(error)
      return response.status(400).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  // Remover item ok
  async remover({ params, response, session }: HttpContext) {
    try {
      this.carrinhoService.remover(session, params.produto_id)

      return response.status(200).json({
        status: 'success',
        message: 'Item removido do carrinho',
      })
    } catch (error: any) {
      return response.status(400).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  // Limpar carrinho ok
  async limpar({ response, session }: HttpContext) {
    try {
      this.carrinhoService.limpar(session)

      return response.status(200).json({
        status: 'success',
        message: 'Carrinho limpo',
      })
    } catch (error: any) {
      return response.status(400).json({
        status: 'error',
        message: error.message,
      })
    }
  }
}

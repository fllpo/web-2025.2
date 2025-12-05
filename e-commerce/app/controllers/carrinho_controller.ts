import type { HttpContext } from '@adonisjs/core/http'
import { CarrinhoService } from '#services/carrinho_service'
import { inject } from '@adonisjs/core'

@inject()
export default class CarrinhoController {
  constructor(protected carrinhoService: CarrinhoService) {}

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

  async total({ session, response }: HttpContext) {
    try {
      const carrinho = this.carrinhoService.obterCarrinho(session)
      const totalItens = this.carrinhoService.contarItens(carrinho)
      return response.json({ total: totalItens })
    } catch (error) {
      return response.status(400).json({ status: 'error' })
    }
  }

  async adicionar({ request, response, session }: HttpContext) {
    try {
      const { produtoId, quantidade } = request.only(['produtoId', 'quantidade'])

      await this.carrinhoService.adicionar(session, produtoId, Number(quantidade) || 1)

      session.flash('success', 'Produto adicionado ao carrinho com sucesso!')

      return response.redirect().back()

    } catch (error: any) {
      console.error(error)
      session.flash('error', error.message || 'Erro ao adicionar produto.')
      return response.redirect().back()
    }
  }

  async atualizar({ request, response, session }: HttpContext) {
    try {
      const quantidade = request.input('quantidade')

      await this.carrinhoService.atualizarQuantidade(session, params.produto_id, Number(quantidade))

      session.flash('success', 'Carrinho atualizado!')
      return response.redirect().back()

    } catch (error: any) {
      session.flash('error', error.message || 'Erro ao atualizar quantidade.')
      return response.redirect().back()
    }
  }

  async remover({ params, response, session }: HttpContext) {
    try {
      this.carrinhoService.remover(session, params.produto_id) 

      session.flash('success', 'Item removido do carrinho.')
      return response.redirect().back()

    } catch (error: any) {}
  }

  async limpar({ response, session }: HttpContext) {
    try {
      this.carrinhoService.limpar(session)

      session.flash('success', 'Seu carrinho está vazio.')
      return response.redirect().back()

    } catch (error: any) {
      session.flash('error', 'Erro ao limpar carrinho.')
      return response.redirect().back()
    }
  }
}
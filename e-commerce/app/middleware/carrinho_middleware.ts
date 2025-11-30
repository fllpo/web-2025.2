import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { CarrinhoService } from '#services/carrinho_service'

export default class CarrinhoMiddleware {
  private carrinhoService = new CarrinhoService()

  async handle({ session, view }: HttpContext, next: NextFn) {
    try {
      const carrinho = this.carrinhoService.obterCarrinho(session)
      const totalItens = this.carrinhoService.contarItens(carrinho)

      view.share({
        carrinhoItens: totalItens,
        carrinho: carrinho,
      })
    } catch (error) {
      view.share({
        carrinhoItens: 0,
        carrinho: [],
      })
    }

    await next()
  }
}

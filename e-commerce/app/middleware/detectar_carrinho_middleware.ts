import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { CarrinhoService } from '#services/carrinho_service'

export default class DetectarCarrinhoMiddleware {
  private carrinhoService = new CarrinhoService()

  async handle({ session, view }: HttpContext, next: NextFn) {
    
    const carrinho = this.carrinhoService.obterCarrinho(session)
    
    const totalItens = this.carrinhoService.contarItens(carrinho)

    view.share({ totalItensGlobal: totalItens })

    await next()
  }
}
import type { HttpContext } from '@adonisjs/core/http'
import { PedidoService } from '#services/pedido_service'
import { CarrinhoService } from '#services/carrinho_service'

export default class PedidosController {
  private pedidoService = new PedidoService()
  private carrinhoService = new CarrinhoService()

  // Página de checkout
  async checkout({ view, session, auth }: HttpContext) {
    const carrinho = this.carrinhoService.obterCarrinho(session)
    const subtotal = this.carrinhoService.calcularTotal(carrinho)
    const usuario = auth.user

    if (carrinho.length === 0) {
      return view.render('pages/carrinho/vazio')
    }

    // Calcular frete baseado no CEP do usuário
    let frete = 0
    let prazoEntrega = 0

    if (usuario?.cep) {
      const freteInfo = await this.pedidoService.calcularFrete(usuario.cep)
      if (freteInfo) {
        frete = freteInfo.valor
        prazoEntrega = freteInfo.prazo
      }
    }

    const total = subtotal + frete

    return view.render('pages/pedidos/checkout', {
      carrinho,
      subtotal,
      frete,
      prazoEntrega,
      total,
      usuario,
    })
  }

  // Finalizar pedido
  async finalizar({ request, response, session, auth }: HttpContext) {
    try {
      const usuario = auth.user

      if (!usuario) {
        return response.status(401).json({
          status: 'error',
          message: 'Usuário não autenticado',
        })
      }

      const carrinho = this.carrinhoService.obterCarrinho(session)

      if (carrinho.length === 0) {
        return response.status(400).json({
          status: 'error',
          message: 'Carrinho vazio',
        })
      }

      const { observacoes } = request.only(['observacoes'])

      // Criar pedido usando endereço do usuário
      const pedido = await this.pedidoService.criarPedido(
        usuario.id,
        carrinho,
        {
          cep: usuario.cep,
          logradouro: usuario.logradouro,
          numero: String(usuario.numero),
          bairro: usuario.bairro,
          cidade: usuario.cidade,
          estado: usuario.estado,
        },
        observacoes
      )

      // Limpar carrinho
      this.carrinhoService.limpar(session)

      return response.redirect().toRoute('pedidos.sucesso', { id: pedido.id })
    } catch (error: any) {
      return response.status(500).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  // Página de sucesso
  async sucesso({ params, view }: HttpContext) {
    const pedido = await this.pedidoService.buscarPorId(params.id)

    if (!pedido) {
      return view.render('pages/errors/not_found', {
        message: 'Pedido não encontrado',
      })
    }

    return view.render('pages/pedidos/sucesso', { pedido })
  }

  // Listar pedidos do usuário
  async meusPedidos({ view, auth }: HttpContext) {
    const usuario = auth.user

    if (!usuario) {
      return view.render('pages/errors/unauthorized')
    }

    const pedidos = await this.pedidoService.listarPorUsuario(usuario.id)

    return view.render('pages/pedidos/meus_pedidos', { pedidos })
  }

  // Detalhes do pedido
  async show({ params, view, auth, response }: HttpContext) {
    const pedido = await this.pedidoService.buscarPorId(params.id)

    if (!pedido) {
      return view.render('pages/errors/not_found', {
        message: 'Pedido não encontrado',
      })
    }

    // Verificar se o pedido é do usuário (ou se é admin)
    const usuario = auth.user
    if (pedido.usuarioId !== usuario?.id && !usuario?.isAdmin) {
      return response.status(403).json({
        status: 'error',
        message: 'Você não tem permissão para ver este pedido',
      })
    }

    return view.render('pages/pedidos/detalhes', { pedido })
  }

  // Cancelar pedido
  async cancelar({ params, response, auth }: HttpContext) {
    try {
      const usuario = auth.user

      if (!usuario) {
        return response.status(401).json({
          status: 'error',
          message: 'Usuário não autenticado',
        })
      }

      await this.pedidoService.cancelar(params.id, usuario.id)

      return response.status(200).json({
        status: 'success',
        message: 'Pedido cancelado com sucesso',
      })
    } catch (error: any) {
      return response.status(400).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  // ========== ROTAS ADMIN ==========

  // Listar todos os pedidos (admin)
  async listarTodos({ view, auth, response }: HttpContext) {
    if (!auth.user || !auth.user.isAdmin) {
      return response.status(403).json({
        status: 'error',
        message: 'Acesso negado',
      })
    }

    const pedidos = await this.pedidoService.listarTodos()
    return view.render('pages/admin/pedidos', { pedidos })
  }

  // Atualizar status do pedido (admin)
  async atualizarStatus({ params, request, response, auth }: HttpContext) {
    if (!auth.user || !auth.user.isAdmin) {
      return response.status(403).json({
        status: 'error',
        message: 'Acesso negado',
      })
    }

    try {
      const { status } = request.only(['status'])
      await this.pedidoService.atualizarStatus(params.id, status)

      return response.status(200).json({
        status: 'success',
        message: 'Status atualizado com sucesso',
      })
    } catch (error: any) {
      return response.status(400).json({
        status: 'error',
        message: error.message,
      })
    }
  }
}

import Pedido from '#models/pedido'
import PedidoItem from '#models/pedido_item'
import TabelaFrete from '#models/tabela_frete'
import { CarrinhoService, type ItemCarrinho } from './carrinho_service.js'

export class PedidoService {
  private carrinhoService = new CarrinhoService()

  // Calcular frete baseado no CEP
  async calcularFrete(cep: string): Promise<{ valor: number; prazo: number } | null> {
    const cepLimpo = cep.replace(/\D/g, '')
    /*
    // Busca na tabela de frete
    const frete = await TabelaFrete.query()
      .where('ativo', true)
      .where((query) => {
        query
          .whereBetween('cepInicio', [cepLimpo, cepLimpo])
          .orWhereBetween('cepFim', [cepLimpo, cepLimpo])
      })
      .first()

    if (frete) {
      return {
        valor: frete.valor,
        prazo: frete.prazoDias,
      }
    }*/

    // Frete padrão se não encontrar
    return {
      valor: 15.0,
      prazo: 5,
    }
  }

  // Criar pedido a partir do carrinho
  async criarPedido(
    usuarioId: string,
    carrinho: ItemCarrinho[],
    enderecoEntrega: {
      cep: string
      logradouro: string
      numero: string
      bairro: string
      cidade: string
      estado: string
      complemento?: string
    },
    observacoes?: string
  ) {
    if (carrinho.length === 0) {
      throw new Error('Carrinho vazio')
    }

    // Calcular frete
    const freteInfo = await this.calcularFrete(enderecoEntrega.cep)
    const valorFrete = freteInfo?.valor || 0

    // Calcular totais
    const subtotal = this.carrinhoService.calcularTotal(carrinho)
    const total = subtotal + valorFrete

    // Criar pedido
    const pedido = await Pedido.create({
      usuarioId,
      subtotal,
      frete: valorFrete,
      total,
      status: 'pendente',
      enderecoCep: enderecoEntrega.cep,
      enderecoLogradouro: enderecoEntrega.logradouro,
      enderecoNumero: enderecoEntrega.numero,
      enderecoBairro: enderecoEntrega.bairro,
      enderecoCidade: enderecoEntrega.cidade,
      enderecoEstado: enderecoEntrega.estado,
      enderecoComplemento: enderecoEntrega.complemento || null,
      observacoes: observacoes || null,
    })

    // Criar itens do pedido
    for (const item of carrinho) {
      await PedidoItem.create({
        pedidoId: pedido.id,
        produtoId: item.produto_id,
        produtoNome: item.nome,
        precoUnitario: item.preco,
        quantidade: item.quantidade,
        subtotal: item.subtotal,
      })
    }

    return pedido
  }

  // Listar pedidos do usuário
  async listarPorUsuario(usuarioId: string) {
    return await Pedido.query()
      .where('usuarioId', usuarioId)
      .preload('itens')
      .orderBy('createdAt', 'desc')
  }

  // Listar todos os pedidos (admin)
  async listarTodos() {
    return await Pedido.query().preload('itens').orderBy('createdAt', 'desc')
  }

  // Buscar pedido por ID
  async buscarPorId(id: string) {
    return await Pedido.query().where('id', id).preload('itens').first()
  }

  // Atualizar status do pedido (admin)
  async atualizarStatus(
    id: string,
    novoStatus: 'pendente' | 'em_separacao' | 'em_transito' | 'entregue' | 'cancelado'
  ) {
    const pedido = await Pedido.find(id)

    if (!pedido) {
      throw new Error('Pedido não encontrado')
    }

    pedido.status = novoStatus
    await pedido.save()

    return pedido
  }

  // Cancelar pedido
  async cancelar(id: string, usuarioId: string) {
    const pedido = await Pedido.find(id)

    if (!pedido) {
      throw new Error('Pedido não encontrado')
    }

    if (pedido.usuarioId !== usuarioId) {
      throw new Error('Você não tem permissão para cancelar este pedido')
    }

    if (pedido.status === 'entregue') {
      throw new Error('Não é possível cancelar um pedido já entregue')
    }

    pedido.status = 'cancelado'
    await pedido.save()

    return pedido
  }
}

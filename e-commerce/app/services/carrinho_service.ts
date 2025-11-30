import { ProdutoService } from '#services/produto_service'

export interface ItemCarrinho {
  produto_id: string
  nome: string
  preco: number
  quantidade: number
  imagem: string | null
  subtotal: number
}

export class CarrinhoService {
  private produtoService = new ProdutoService()

  // Obter carrinho da sessão
  obterCarrinho(session: any): ItemCarrinho[] {
    if (!session) return []
    try {
      return session.get('carrinho', [])
    } catch {
      return []
    }
  }

  // Adicionar produto ao carrinho
  async adicionar(session: any, produto_id: string, quantidade: number = 1) {
    const produto = await this.produtoService.buscarPorID(produto_id)

    if (!produto) {
      throw new Error('Produto não encontrado')
    }

    if (produto.quantidade < quantidade) {
      throw new Error('Quantidade em estoque insuficiente')
    }

    const carrinho = this.obterCarrinho(session)
    const itemExistente = carrinho.find((item) => item.produto_id === produto_id)

    if (itemExistente) {
      // Atualizar quantidade
      itemExistente.quantidade += quantidade
      itemExistente.subtotal = itemExistente.quantidade * itemExistente.preco
    } else {
      // Adicionar novo item
      carrinho.push({
        produto_id: produto.id,
        nome: produto.nome,
        preco: produto.preco_pix,
        quantidade: quantidade,
        imagem: produto.imagem,
        subtotal: produto.preco_pix * quantidade,
      })
    }

    session.put('carrinho', carrinho)
    return carrinho
  }

  // Atualizar quantidade de um item
  async atualizarQuantidade(session: any, produto_id: string, quantidade: number) {
    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero')
    }

    const produto = await this.produtoService.buscarPorID(produto_id)

    if (!produto) {
      throw new Error('Produto não encontrado')
    }

    if (produto.quantidade < quantidade) {
      throw new Error('Quantidade em estoque insuficiente')
    }

    const carrinho = this.obterCarrinho(session)
    const item = carrinho.find((carrinhoItem) => carrinhoItem.produto_id === produto_id)

    if (!item) {
      throw new Error('Item não encontrado no carrinho')
    }

    item.quantidade = quantidade
    item.subtotal = item.quantidade * item.preco

    session.put('carrinho', carrinho)
    return carrinho
  }

  // Remover item do carrinho
  remover(session: any, produto_id: string) {
    const carrinho = this.obterCarrinho(session)
    const novoCarrinho = carrinho.filter((item) => item.produto_id !== produto_id)

    session.put('carrinho', novoCarrinho)
    return novoCarrinho
  }

  // Limpar carrinho
  limpar(session: any) {
    session.put('carrinho', [])
    return []
  }

  // Calcular total do carrinho
  calcularTotal(carrinho: ItemCarrinho[]): number {
    return carrinho.reduce((total, item) => total + item.subtotal, 0)
  }

  // Contar itens no carrinho
  contarItens(carrinho: ItemCarrinho[]): number {
    return carrinho.reduce((total, item) => total + item.quantidade, 0)
  }
}

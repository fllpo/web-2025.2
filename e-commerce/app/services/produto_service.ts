import Produto from '#models/produto'

export class ProdutoService {
  async listarTodos() {
    return await Produto.all()
  }

  async listarPaginado(pagina: number = 1, limite: number = 10) {
    return await Produto.query().paginate(pagina, limite)
  }

  async buscaPorID(id: number) {
    return await Produto.find(id)
  }

  async criar(dados: {
    nome: string
    descricao: string
    preco: number
    quantidade: number
    imagem?: string
  }) {
    return await Produto.create({
      nome: dados.nome,
      descricao: dados.descricao,
      preco: dados.preco,
      quantidade: dados.quantidade,
      imagem: dados.imagem || 'https://placehold.co/400',
    })
  }

  async atualizar(
    id: number,
    dados: {
      nome?: string
      descricao?: string
      preco?: number
      quantidade?: number
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

  async deletar(id: number) {
    const produto = await Produto.find(id)

    if (!produto) {
      return false
    }

    await produto.delete()
    return true
  }

  async buscarPorNome(nome: string) {
    return await Produto.query().where('nome', 'ILIKE', `%${nome}%`).exec()
  }

  validarDados(dados: { nome: string; descricao: string; preco: number; quantidade: number }) {
    const erros = []

    if (!dados.nome || dados.nome.trim().length < 2) {
      erros.push('Nome deve ter pelo menos 2 caracteres')
    }

    if (!dados.descricao || dados.descricao.trim().length < 10) {
      erros.push('Descrição deve ter pelo menos 10 caracteres')
    }
    if (!dados.preco || dados.preco <= 0) {
      erros.push('Preço deve ser maior que zero')
    }
    if (!dados.quantidade || dados.quantidade <= 0) {
      erros.push('Quantidade deve ser maior que zero')
    }

    return erros
  }
}

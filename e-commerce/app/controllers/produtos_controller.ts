import type { HttpContext } from '@adonisjs/core/http'
import { ProdutoService } from '#services/produto_service'

export default class ProdutosController {
  private produtoService = new ProdutoService()

  async index({ view }: HttpContext) {
    try {
      const produtos = await this.produtoService.listarTodos()
      //const produtos = await this.produtoService.listarPaginado()
      return view.render('pages/produtos/produtos', { produtos })
    } catch (error) {
      return view.render('pages/produtos/produtos', { produtos: [] })
    }
  }

  async create({ view }: HttpContext) {
    return view.render('pages/produtos/criar_produto')
  }

  // Cria um novo produto OK
  async store({ request, response }: HttpContext) {
    try {
      const dados = request.only([
        'nome',
        'tipo',
        'animal',
        'peso_saco',
        'quantidade',
        'preco_pix',
        //'preco_cartao',
      ])

      //TODO
      /*
      const erros = this.produtoService.validarDados(dados)

      if (erros.length > 0) {
        return response.status(422).json({
          status: 'error',
          message: 'Erro de validação',
          errors: erros,
        })
      }*/

      const imagem = request.file('imagem', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (imagem && !imagem.isValid)
        return response.status(422).json({
          status: 'error',
          message: 'Arquivo inválido',
          erros: imagem.errors,
        })

      let nomeImagem
      try {
        nomeImagem = await this.produtoService.salvarImagem(imagem)
      } catch (error) {
        return response.status(500).json({
          status: 'error',
          message: 'Erro ao fazer upload da imagem',
        })
      }

      await this.produtoService.criar({
        nome: dados.nome,
        tipo: dados.tipo,
        animal: dados.animal,
        preco_pix: Number(dados.preco_pix),
        //preco_cartao: Number(dados.preco_cartao),
        peso_saco: Number(dados.peso_saco),
        quantidade: Number(dados.quantidade),
        imagem: nomeImagem || undefined,
      })

      return response.status(201).redirect().toRoute('produto.listar')
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao criar produto',
      })
    }
  }

  // Mostra um produto específico
  async show({ params, view, response }: HttpContext) {
    try {
      const produto = await this.produtoService.buscarPorID(params.id)

      if (!produto) {
        return view.render('pages/errors/not_found', {
          message: 'Produto não encontrado',
        })
      }
      return view.render('pages/produtos/produto_detalhe', { produto })
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao buscar o produto',
      })
    }
  }
  // TODO
  async edit({ params, view, response }: HttpContext) {
    try {
      const produto = await this.produtoService.buscarPorID(params.id)

      if (!produto) {
        return view.render('pages/errors/not_found', { message: 'Produto não encontrado' })
      }
      return view.render('pages/produtos/editar_produto', { produto })
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao buscar o produto',
      })
    }
  }

  //TODO Atualiza um produto
  async update({ params, request, response }: HttpContext) {
    try {
      const produto = await this.produtoService.buscarPorID(params.id)

      if (!produto) {
        return response.status(404).json({
          status: 'error',
          message: 'Produto não encontrado',
        })
      }

      const dados = request.only([
        'nome',
        'tipo',
        'animal',
        'peso_saco',
        'quantidade',
        'preco_pix',
        //'preco_cartao',
      ])

      //TODO
      /*
      const erros = this.produtoService.validarDados(dados)
      if (erros.length > 0) {
        return response.status(422).json({
          status: 'error',
          message: 'Erro de validação',
          errors: erros,
        })
      }*/

      const imagem = request.file('imagem', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (imagem && imagem.isValid) {
        return response.status(422).json({
          status: 'error',
          message: 'Arquivo inválido',
          erros: imagem.errors,
        })
      }

      let nomeImagem: string | null | undefined = produto.imagem

      if (imagem) {
        try {
          if (produto.imagem) {
            nomeImagem = await this.produtoService.substituirImagemProduto(produto.imagem, imagem)
          }
        } catch (error) {
          return response.status(500).json({
            status: 'error',
            message: 'Erro ao fazer upload da imagem',
          })
        }
      }

      await this.produtoService.atualizar(params.id, {
        nome: dados.nome,
        tipo: dados.tipo,
        animal: dados.animal,
        preco_pix: Number(dados.preco_pix),
        //preco_cartao: Number(dados.preco_cartao),
        peso_saco: Number(dados.peso_saco),
        quantidade: Number(dados.quantidade),
        imagem: nomeImagem || undefined,
      })

      response.redirect().toRoute('produto.detalhe', { id: params.id })
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao atualizar produto',
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const deletado = await this.produtoService.deletarProduto(params.id)

      if (!deletado) {
        return response.status(404).json({
          status: 'error',
          message: 'Produto não encontrado',
        })
      }

      return response.redirect().toRoute('produto.listar')
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao deletar produto',
      })
    }
  }
}

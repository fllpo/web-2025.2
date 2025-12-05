import type { HttpContext } from '@adonisjs/core/http'
import { ProdutoService } from '#services/produto_service'
import { criarProdutoValidator } from '#validators/produto'
import { Session } from '@adonisjs/session'

export default class ProdutosController {
  private produtoService = new ProdutoService()

  async index({ view, request }: HttpContext) {
    try {
      const pagina = request.input('page', 1)
      const limite = 8
      
      const busca = request.input('busca')

      const produtos = await this.produtoService.listarPaginado(pagina, limite, busca)

      produtos.baseUrl('/produtos')
      produtos.queryString({ busca: busca })

      return view.render('pages/produtos/produtos', { produtos, busca })
    } catch (error) {
      console.log(error)
      return view.render('pages/produtos/produtos', { produtos: [] })
    }
  }

  async create({ view }: HttpContext) {
    return view.render('pages/produtos/criar_produto')
  }

  // Cria um novo produto OK
  async store({ request, response, session}: HttpContext) {
    try {
      const dados = await request.validateUsing(criarProdutoValidator)

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

      session.flash('success', 'Produto criado com sucesso!')

      return response.redirect().toRoute('produto.listar')
    } catch (error) {
      console.log(error)
      return response.redirect().back()
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
      console.log(error)
      return response.redirect().back()
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
      console.log(error)
      return response.redirect().back()
    }
  }

  //TODO Atualiza um produto
  async update({ params, request, response, session }: HttpContext) {
    try {
      const produto = await this.produtoService.buscarPorID(params.id)

      if (!produto) {
        session.flash('error', 'Produto não encontrado.')
        return response.redirect().toRoute('produto.listar')
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

      if (imagem && !imagem.isValid) {
        session.flash('error', `Imagem inválida: ${imagem.errors[0].message}`)
        return response.redirect().back()
      }

      let nomeImagem: string | null | undefined = produto.imagem

      if (imagem) {
        try {
          if (produto.imagem) {
            nomeImagem = await this.produtoService.substituirImagemProduto(produto.imagem, imagem)
          }
          else {
            nomeImagem = await this.produtoService.salvarImagem(imagem)
          }
        } catch (error) {
          console.log(error)
          session.flash('error', 'Erro ao processar a nova imagem.')
          return response.redirect().back()
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

      session.flash('success', 'Produto atualizado com sucesso!')

      return response.redirect().toRoute('produto.detalhe', { id: params.id })

    } catch (error) {
      console.log(error)
      session.flash('error', 'Erro inesperado ao atualizar produto.')
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    try {
      const deletado = await this.produtoService.deletarProduto(params.id)

      if (!deletado) {
        session.flash('error', 'Produto não encontrado')
        return response.redirect().back()
      }

      session.flash('success', 'Produto deletado com sucesso')
      return response.redirect().toRoute('produto.listar')

    } catch (error) {
      console.log(error)
      session.flash('error', 'Erro ao deletar produto.')
      return response.redirect().back()
    }
  }
}

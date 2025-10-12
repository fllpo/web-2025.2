import type { HttpContext } from '@adonisjs/core/http'
import { ProdutoService } from '#services/produto_service'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
export default class ProdutosController {
  private produtoService = new ProdutoService()

  //Lista todos os produtos OK
  async index({ view }: HttpContext) {
    try {
      const produtos = await this.produtoService.listarTodos()
      return view.render('pages/produtos/produtos', { produtos })
    } catch (error) {
      return view.render('pages/produtos/produtos', { produtos: [] })
    }
  }

  // Formulário Criação OK
  async create({ view }: HttpContext) {
    return view.render('pages/produtos/criar_produto')
  }

  // Cria um novo produto OK
  async store({ request, response, session }: HttpContext) {
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

      const erros = this.produtoService.validarDados(dados)

      if (erros.length > 0) {
        session.flash('errors', erros)
        return response.redirect().back()
      }

      const imagem = request.file('imagem', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (!imagem?.isValid) return response.badRequest({ errors: imagem?.errors })

      try {
        await imagem.move(app.makePath('/resources/images/uploads/produtos'), {
          name: `${cuid()}.${imagem.extname}`,
        })
      } catch (e) {
        console.log(e)
      }

      await this.produtoService.criar({
        nome: dados.nome,
        tipo: dados.tipo,
        animal: dados.animal,
        preco_pix: Number(dados.preco_pix),
        //preco_cartao: Number(dados.preco_cartao),
        peso_saco: Number(dados.peso_saco),
        quantidade: Number(dados.quantidade),
        imagem: imagem.fileName,
      })

      session.flash('success', 'Produto criado com sucesso!')
      return response.redirect().toRoute('produto.listar')
    } catch (error) {
      console.log(error)
      session.flash('error', 'Erro ao criar produto')
      return response.redirect().back()
    }
  }

  // Mostra um produto específico
  async show({ params, view, response }: HttpContext) {
    try {
      const produto = await this.produtoService.buscaPorID(params.id)

      if (!produto) {
        return view.render('pages/errors/not_found', { message: 'Produto não encontrado' })
      }
      return view.render('pages/produtos/produto_detalhe', { produto })
    } catch (error) {
      return response.redirect().toRoute('produtos.listar')
    }
  }
  // TODO
  async edit({ params, view, response }: HttpContext) {
    try {
      const produto = await this.produtoService.buscaPorID(params.id)

      if (!produto) {
        return view.render('pages/errors/not_found', { message: 'Produto não encontrado' })
      }
      return view.render('pages/produtos/editar_produto', { produto })
    } catch (error) {
      return view.render('pages/errors/server_error', {
        message: 'Erro ao carregar produto',
      })
    }
  }

  //TODO Atualiza um produto
  async update({ params, request, response, session }: HttpContext) {
    try {
      const dados = request.only([
        'nome',
        'tipo',
        'animal',
        'peso_saco',
        'quantidade',
        'preco_pix',
        //'preco_cartao',
        //'imagem',
      ])

      const produto = await this.produtoService.atualizar(params.id, {
        nome: dados.nome,
        tipo: dados.tipo,
        animal: dados.animal,
        preco_pix: Number(dados.preco_pix),
        //preco_cartao: Number(dados.preco_cartao),
        //imagem: dados.imagem,
        peso_saco: Number(dados.peso_saco),
        quantidade: Number(dados.quantidade),
      })

      if (!produto) {
        session.flash('error', 'Produto não encontrado')
        return response.redirect().back()
      }

      session.flash('success', 'Produto atualizado com sucesso!')
      response.redirect().toRoute('produto.detalhe', { id: params.id })
    } catch (error) {
      session.flash('error', 'Erro ao atualizar produto')
      response.redirect().back()
    }
  }

  //Apaga um produto do banco de dados
  async destroy({ params, response, session }: HttpContext) {
    try {
      const produto = await this.produtoService.buscaPorID(params.id)

      if (!produto) {
        return response.status(404).json({ message: 'Produto não encontrado' })
      }

      await produto.delete()
      return response.status(200).json({ message: 'Produto deletado com sucesso' })
    } catch (e) {
      console.log(e)
    }
  }
}

/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

// ==========================================================================
// DATA STORAGE (Em memória - considerar migrar para banco de dados)
// ==========================================================================

interface Produto {
  id: number
  nome: string
  descricao: string
  preco: number
  imagem: string
}

interface Usuario {
  id: number
  nome: string
  telefone: string
  cep: string
  logradouro: string
  numero: string
  cidade: string
  estado: string
  email: string
  senha: string
}

// Dados mockados
const produtos: Produto[] = [
  {
    id: 1,
    nome: 'Produto 1',
    descricao: 'Descrição do Produto 1',
    preco: 10.0,
    imagem: 'https://placehold.co/150',
  },
  {
    id: 2,
    nome: 'Produto 2',
    descricao: 'Descrição do Produto 2',
    preco: 20.0,
    imagem: 'https://placehold.co/150',
  },
  {
    id: 3,
    nome: 'Produto 3',
    descricao: 'Descrição do Produto 3',
    preco: 30.0,
    imagem: 'https://placehold.co/150',
  },
  {
    id: 4,
    nome: 'Produto 4',
    descricao: 'Descrição do Produto 4',
    preco: 40.0,
    imagem: 'https://placehold.co/150',
  },
]
const usuarios: Usuario[] = []

function encontrarProdutoPorId(id: number): Produto | undefined {
  return produtos.find((produto) => produto.id === id)
}

function validarUsuario(dados: Partial<Usuario>): string[] {
  const erros: string[] = []
  if (!dados.email || !dados.email.includes('@')) {
    erros.push('Email inválido')
  }
  if (!dados.senha || dados.senha.length < 8) {
    erros.push('Senha deve ter ao menos 8 caracteres')
  }
  return erros
}

// ==========================================================================
// ROTAS - PRODUTOS
// ==========================================================================

// Listar todos os produtos
router
  .get('/', async ({ view }) => {
    return view.render('pages/produtos/produtos', { produtos })
  })
  .as('produtos.listar')
router
  .group(() => {
    // Formulário para criar um novo produto
    router
      .get('/novo', async ({ view }) => {
        return view.render('pages/produtos/criar_produto')
      })
      .as('produto.novo')

    // Criar um novo produto
    router
      .post('/novo', async ({ request, response }: HttpContext) => {
        const nome = request.input('nome')
        const descricao = request.input('descricao')
        const preco = request.input('preco')
        const imagem = 'https://placehold.co/150'

        const novoProduto = {
          id: produtos.length + 1,
          nome,
          descricao,
          preco: Number.parseFloat(preco),
          imagem,
        }

        produtos.push(novoProduto)

        return response.redirect().toRoute('produtos.listar')
      })
      .as('produto.criar')
    // Detalhes de um produto específico
    router
      .get('/:id', async ({ view, params }: HttpContext) => {
        const produtoId = Number(params.id)
        const produto = encontrarProdutoPorId(produtoId)

        if (!produto) {
          return view.render('pages/errors/not_found', {
            message: 'Produto não existe',
          })
        }

        return view.render('pages/produtos/produto', { produto })
      })
      .as('produto.detalhe')
  })
  .prefix('/produtos')

router
  .group(() => {
    // ========================================================================
    // ROTAS - USUÁRIOS
    // ========================================================================

    router
      .get('/login', async ({ view }) => {
        return view.render('pages/usuario/login')
      })
      .as('usuario.login')
    router.post('/login', async ({ request, response }: HttpContext) => {
      const email = request.input('email')
      const senha = request.input('senha')

      const usuario = usuarios.find((user) => user.email === email && user.senha === senha)

      if (usuario) {
        // Autenticação bem-sucedida
        console.log('Usuário autenticado:', usuario)
        return response.redirect().toRoute('produtos.listar')
      } else {
        // Falha na autenticação
        console.log('Falha na autenticação para o email:', email)
        return response.redirect().toRoute('usuario.login')
      }
    })

    router
      .get('/cadastrar', async ({ view }) => {
        return view.render('pages/usuario/cadastrar')
      })
      .as('usuario.formulario')

    router
      .post('/cadastrar/', async ({ request, response }: HttpContext) => {
        const novoUsuario = {
          id: usuarios.length + 1,
          nome: request.input('nome'),
          telefone: request.input('telefone'),
          cep: request.input('cep'),
          logradouro: request.input('logradouro'),
          numero: request.input('numero'),
          cidade: request.input('cidade'),
          estado: request.input('estado'),
          email: request.input('email'),
          senha: request.input('senha'),
        }

        console.log(novoUsuario)

        usuarios.push(novoUsuario)

        return response.redirect().toRoute('usuario.login')
      })
      .as('usuario.criar')

    router
      .get('/usuarios', async ({ response }) => {
        return response.json(usuarios)
      })
      .as('usuario.listar')
  })
  .prefix('/usuario')

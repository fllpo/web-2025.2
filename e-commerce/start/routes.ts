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

const produtos = [
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

router
  .get('/', async ({ view }) => {
    return view.render('pages/produtos', { produtos })
  })
  .as('produtos')

router
  .get('/login', async ({ view }) => {
    return view.render('pages/login')
  })
  .as('login')

router.get('/cadastrar', async ({ view }) => {
  return view.render('pages/cadastrar')
})

router
  .get('/produto/:id', async ({ view, params }: HttpContext) => {
    const produtoId = Number(params.id)

    for (const produto of produtos) {
      if (produto.id === produtoId) {
        return view.render('pages/produto', { produto })
      }
    }
  })
  .as('produto')

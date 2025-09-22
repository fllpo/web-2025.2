/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')

router
  .get('/produtos', async ({ view }) => {
    const collections = [
      { nome: 'Produto 1', descricao: 'Descrição do Produto 1', preco: 10.0 },
      { nome: 'Produto 2', descricao: 'Descrição do Produto 2', preco: 20.0 },
      { nome: 'Produto 3', descricao: 'Descrição do Produto 3', preco: 30.0 },
      { nome: 'Produto 4', descricao: 'Descrição do Produto 4', preco: 40.0 },
    ]
    return view.render('pages/produtos', { collections })
  })
  .as('produtos')

router
  .get('/produtos/:id', async ({ params, view }) => {
    const produto = {
      id: params.id,
      nome: `Produto ${params.id}`,
      descricao: `Descrição detalhada do Produto ${params.id}`,
      preco: Number.parseFloat(params.id) * 10.0,
    }
    return view.render('pages/produtos', { produto })
  })
  .as('produtos.show')

router.get('/login', async ({ view }) => {
  return view.render('pages/login')
})

router.get('/registrar', async ({ view }) => {
  return view.render('pages/registrar')
})

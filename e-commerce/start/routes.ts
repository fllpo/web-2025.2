/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const ProdutosController = () => import('#controllers/produtos_controller')
const UsuariosController = () => import('#controllers/usuarios_controller')

router.get('/', [ProdutosController, 'index']).as('produto.listar')
router
  .group(() => {
    router.get('/novo', [ProdutosController, 'create']).as('produto.novo')

    router.post('/novo', [ProdutosController, 'store']).as('produto.criar')

    router.get('/:id', [ProdutosController, 'show']).as('produto.detalhe')

    router.get('/:id/editar', [ProdutosController, 'edit']).as('produto.editar')

    router.put('/:id', [ProdutosController, 'update']).as('produto.atualizar')

    router.delete('/:id', [ProdutosController, 'destroy']).as('produto.deletar')
  })
  .prefix('/produtos')

// ========================================================================
// ROTAS - USUÁRIOS
// ========================================================================
router
  .group(() => {
    router.get('/cadastrar', [UsuariosController, 'signin']).as('usuario.cadastrar')
    router.post('/cadastrar', [UsuariosController, 'store']).as('usuario.criar')

    router.get('/login', [UsuariosController, 'login']).as('usuario.login')
    router.post('/login', [UsuariosController, 'authenticate']).as('usuario.autenticar')
  })
  .prefix('/usuario')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const ProdutosController = () => import('#controllers/produtos_controller')
const UsuariosController = () => import('#controllers/usuarios_controller')
const SessionController = () => import('#controllers/session_controller')
const PerfilsController = () => import('#controllers/perfils_controller')

// ========================================================================
// ROTAS - PRODUTOS
// ========================================================================

router.get('/', [ProdutosController, 'index']).as('produto.listar').use(middleware.silentAuth())
router
  .get('produto/:id', [ProdutosController, 'show'])
  .as('produto.detalhe')
  .use(middleware.silentAuth())

router
  .group(() => {
    router.get('/novo', [ProdutosController, 'create']).as('produto.novo')
    router.post('/novo', [ProdutosController, 'store']).as('produto.criar')

    router.get('/:id/editar', [ProdutosController, 'edit']).as('produto.editar')
    router.put('/:id', [ProdutosController, 'update']).as('produto.atualizar')
    router.delete('/:id', [ProdutosController, 'destroy']).as('produto.deletar')
  })
  .prefix('/produtos')
  .use(middleware.auth())

// ========================================================================
// ROTAS - USUÁRIOS
// ========================================================================

router
  .group(() => {
    router.get('/cadastrar', [UsuariosController, 'signin']).as('usuario.cadastrar')
    router.post('/cadastrar', [UsuariosController, 'store']).as('usuario.criar')
  })
  .prefix('/usuario')

router.group(() => {
  router.get('/login', [SessionController, 'create']).as('usuario.login')
  router.post('/login', [SessionController, 'store']).as('usuario.autenticar')
  router.get('/logout', [SessionController, 'destroy']).as('usuario.logout')
})

router
  .group(() => {
    router.get('/perfil', [PerfilsController, 'show']).as('profile.show')
    router.get('/perfil/edit', [PerfilsController, 'edit']).as('profile.edit')
    router.post('/perfil;edit', [PerfilsController, 'update']).as('profile.update')
  })
  .use(middleware.auth())

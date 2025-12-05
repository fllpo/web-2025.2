import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const ProdutosController = () => import('#controllers/produtos_controller')
const UsuariosController = () => import('#controllers/usuarios_controller')
const SessionController = () => import('#controllers/session_controller')
const PerfilsController = () => import('#controllers/perfils_controller')
const CarrinhoController = () => import('#controllers/carrinho_controller')
const PedidosController = () => import('#controllers/pedidos_controller')

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
    router.post('/:id', [ProdutosController, 'update']).as('produto.atualizar')
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
    router.get('/', [PerfilsController, 'show']).as('profile.show')
    router.get('/edit', [PerfilsController, 'edit']).as('profile.edit')
    router.post('/edit', [PerfilsController, 'update']).as('profile.update')
  })
  .prefix('/perfil')
  .use(middleware.auth())

// ========================================================================
// ROTAS - CARRINHO
// ========================================================================

router
  .group(() => {
    router.get('/', [CarrinhoController, 'index']).as('carrinho.index')
    router.post('/adicionar', [CarrinhoController, 'adicionar']).as('carrinho.adicionar')
    router.put('/atualizar', [CarrinhoController, 'atualizar']).as('carrinho.atualizar')
    router.delete('/:produto_id', [CarrinhoController, 'remover']).as('carrinho.remover')
    router.delete('/limpar/tudo', [CarrinhoController, 'limpar']).as('carrinho.limpar')
    router.get('/total', [CarrinhoController, 'total']).as('carrinho.total')
  })
  .prefix('/carrinho')
  .use(middleware.auth())
// Adicione no seu start/routes.ts

// ========================================================================
// ROTAS - PEDIDOS (Usuário precisa estar logado)
// ========================================================================
router
  .group(() => {
    router.get('/checkout', [PedidosController, 'checkout']).as('pedidos.checkout')
    router.post('/finalizar', [PedidosController, 'finalizar']).as('pedidos.finalizar')
    router.get('/sucesso/:id', [PedidosController, 'sucesso']).as('pedidos.sucesso')
    router.get('/meus-pedidos', [PedidosController, 'meusPedidos']).as('pedidos.meus')
    router.get('/:id', [PedidosController, 'show']).as('pedidos.detalhes')
    router.delete('/:id/cancelar', [PedidosController, 'cancelar']).as('pedidos.cancelar')
  })
  .prefix('/pedidos')
  .use(middleware.auth())

// ========================================================================
// ROTAS - ADMIN (Gerenciar pedidos)
// ========================================================================
router
  .group(() => {
    router.get('/pedidos', [PedidosController, 'listarTodos']).as('admin.pedidos')
    router
      .put('/pedidos/:id/status', [PedidosController, 'atualizarStatus'])
      .as('admin.pedidos.status')
  })
  .prefix('/admin')
  .use(middleware.auth())

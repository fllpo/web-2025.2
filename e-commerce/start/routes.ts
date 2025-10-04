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

// ==========================================================================
// ROTAS - PRODUTOS
// ==========================================================================

router.get('/', [ProdutosController, 'index']).as('produto.listar')
router
  .group(() => {
    router.get('/novo', [ProdutosController, 'create']).as('produto.novo')

    router.post('/novo', [ProdutosController, 'create']).as('produto.criar')

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

    router.get('/login', [UsuariosController, 'login']).as('usuario.login')

    router.post('/cadastrar', [UsuariosController, 'store']).as('usuario.criar')

    /*
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
      .get('/cadastrar', async ({ view }: HttpContext) => view.render('pages/usuario/cadastrar'))
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
      */
  })
  .prefix('/usuario')

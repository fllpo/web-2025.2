import type { HttpContext } from '@adonisjs/core/http'
import { UsuarioService } from '#services/usuario_service'
import { inject } from '@adonisjs/core'
import app from '@adonisjs/core/services/app' // 1. Importe 'app'
import { cuid } from '@adonisjs/core/helpers'
// import Status from '@adonisjs/lucid/commands/migration/status'
// import { messages } from '@vinejs/vine/defaults'

@inject()
export default class PerfilsController {
    // private usuariService = new UsuarioService()

    // / 4. Crie o construtor para injetar o serviço
    constructor(protected usuarioService: UsuarioService) {}

    public async show({auth, view}: HttpContext){
        const usuario = auth.user
        return view.render('pages/profile/show', { usuario })
    }

    public async edit({auth, view}: HttpContext){
        const usuario = auth.user
        return view.render('pages/profile/edit', { usuario })
    }
    /**
   * Recebe os dados do formulário e atualiza o usuário
   */
//   public async update({ auth, request, response, session }: HttpContext) {
    
//     // 1. Pega o ID do usuário que está logado
//     const usuarioId = auth.user!.id 

//     // 2. Pega os dados do formulário
//     // (Exatamente como o formulário envia)
//     const data = request.only([
//       'nome', 
//       'email', 
//       'foto_perfil', 
//       'telefone',
//       'logradouro',
//       'bairro',
//       'cidade',
//       'estado',
//       'cep'
//     ])

//     // 3. Renomeia 'foto_perfil' para 'fotoPerfil' para bater com seu serviço
//     //    Isso é necessário se o seu serviço espera 'fotoPerfil' (camelCase)
//     //    mas o formulário envia 'foto_perfil' (snake_case)
//     const dadosParaAtualizar: any = data

    
//     if (dadosParaAtualizar.foto_perfil !== undefined) {
//       dadosParaAtualizar.fotoPerfil = dadosParaAtualizar.foto_perfil;
//       delete dadosParaAtualizar.foto_perfil;
//     }

//     try {
//       // 4. Chama o serviço com o ID e os dados corretos
//       const usuario = await this.usuariService.atualizar(usuarioId, dadosParaAtualizar)

//       if (!usuario) {
//         // Isso não deve acontecer se o usuário está logado, mas é uma boa checagem
//         session.flash('error', 'Usuário não encontrado.')
//         return response.redirect().back()
//       }

//       // 5. Sucesso! Cria a mensagem e redireciona
//       session.flash('success', 'Perfil atualizado com sucesso!')
//       return response.redirect().toRoute('profile.show')

//     } catch (error) {
//       console.error(error)
//       session.flash('error', 'Ocorreu um erro ao atualizar o perfil.')
//       return response.redirect().back()
//     }
//   }

    // public async update({params, request, response}: HttpContext){
    //     try{
    //         const usuario = await this.usuariService.buscarPorEmail(params.email)

    //         if (!usuario) {
    //             return response.status(404).json({
    //                 status: 'error',
    //                 message: 'Usuário não encontrado ' + params.email + '.'
    //             })
    //         }
    //         const dados = request.only([
    //             'nome',
    //             'email', 
    //             'telefone', 
    //             'logradouro',
    //             'cep', 
    //             'numero', 
    //             'cidade',
    //             'estado',
    //             'bairro'
    //         ])

    //         const foto_perfil = request.file('fotoPerfil', {
    //             size: '2mb',
    //             extnames: ['jpg', 'jpeg', 'png', 'webp'],
    //         })

    //         if (foto_perfil && foto_perfil.isValid) {
    //             return response.status(422).json({
    //                 status: 'error',
    //                 message: 'Arquivo inválido',
    //                 erros: foto_perfil.errors,
    //             })
    //         }

    //         let nomeImagem: string | null | undefined = usuario.fotoPerfil

    //         if (foto_perfil) {
    //             try {
    //             if (usuario.fotoPerfil) {
    //                 nomeImagem = await this.usuariService.substituirImagemPerfil(usuario.fotoPerfil, foto_perfil)
    //             }
    //             } catch (error) {
    //             console.log(error)
    //             return response.redirect().back()
    //             }
    //         }

    //         await this.usuariService.atualizar(params.id, {
    //             nome: dados.nome,
    //             telefone: dados.telefone,
    //             cep: dados.cep,
    //             logradouro: dados.logradouro,
    //             numero: Number(dados.numero),
    //             cidade: dados.cidade,
    //             estado: dados.estado,
    //             bairro: dados.bairro,
    //             fotoPerfil: nomeImagem || undefined,
    //         })

    //         response.redirect().toRoute('profile.show', {id: params.id})
    //     }catch (error){
    //         console.log(error)
    //         return response.redirect().back()
    //     }
    // }
    public async update({ auth, request, response, session }: HttpContext) {
    const usuarioId = auth.user!.id
    
    // 1. Pegar os dados de texto
    const data = request.only([
      'nome', 'email', 'telefone', 'logradouro', 
      'bairro', 'cidade', 'estado', 'cep'
    ])
    
    // 2. Preparar o objeto de dados para o serviço
    const dadosParaAtualizar: any = data

    // 3. Processar o ARQUIVO de imagem
    const foto = request.file('foto_perfil', {
      size: '2mb', // Limite de 2MB
      extnames: ['jpg', 'png', 'jpeg', 'webp'], // Extensões permitidas
    })

    // Se o usuário enviou uma foto válida...
    if (foto && foto.isValid) {
      // 4. Crie um nome único para o arquivo (ex: 1ab2cd3e.jpg)
      const novoNome = `${cuid()}.${foto.extname}`

      // 5. Mova o arquivo para a pasta pública
      await foto.move(app.publicPath('uploads/usuarios'), {
        name: novoNome,
      })

      // 6. Adicione o NOME DO ARQUIVO aos dados que serão salvos
      // (lembra que seu serviço espera 'fotoPerfil'?)
      dadosParaAtualizar.fotoPerfil = novoNome

      // 7. (Opcional) Deletar a foto antiga, se existir
      // (você precisaria implementar isso)

    } else if (foto && !foto.isValid) {
      // Se o arquivo for inválido (tamanho/extensão)
      session.flash('error', `Erro no upload: ${foto.errors[0].message}`)
      return response.redirect().back()
    }
    
    // 8. Chame o serviço para atualizar o banco
    try {
      await this.usuarioService.atualizar(usuarioId, dadosParaAtualizar)

      session.flash('success', 'Perfil atualizado com sucesso!')
      return response.redirect().toRoute('profile.show')

    } catch (error) {
      console.error(error)
      session.flash('error', 'Ocorreu um erro ao atualizar o perfil.')
      return response.redirect().back()
    }
  }
}
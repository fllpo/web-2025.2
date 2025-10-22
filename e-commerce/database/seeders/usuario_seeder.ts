import Usuario from '#models/usuario'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Usuario.create({
      nome: 'Administrador',
      telefone: '(21) 00000-0000',
      cep: '26285-060',
      logradouro: 'Av. Gov. Roberto Silveira',
      numero: 1,
      cidade: 'Nova Iguaçu',
      estado: 'RJ',
      bairro: 'Moquetá',
      email: 'admin@admin.com',
      senha: '7%uj0#5&AQu8$0',
      isAdmin: true,
      fotoPerfil: null,
    })
  }
}

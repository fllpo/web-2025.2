import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Produto from '#models/produto'
export default class extends BaseSeeder {
  async run() {
    await Produto.createMany([
      {
        nome: 'Produto 1',
        descricao: 'Descrição do Produto 1',
        preco: 10.0,
        imagem: 'https://placehold.co/150',
      },
      {
        nome: 'Produto 2',
        descricao: 'Descrição do Produto 2',
        preco: 20.0,
        imagem: 'https://placehold.co/150',
      },
      {
        nome: 'Produto 3',
        descricao: 'Descrição do Produto 3',
        preco: 30.0,
        imagem: 'https://placehold.co/150',
      },
      {
        nome: 'Produto 4',
        descricao: 'Descrição do Produto 4',
        preco: 40.0,
        imagem: 'https://placehold.co/150',
      },
    ])
  }
}

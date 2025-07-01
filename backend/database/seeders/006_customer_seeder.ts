import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '../../app/models/user.js'
import Customer from '../../app/models/customer.js'

export default class extends BaseSeeder {
  async run() {
    const user = await User.findBy('email', 'nassim@mail.com')

    if (!user) {
      return
    }

    const customers = [
      {
        userId: user.id,
        companyName: 'Salair Technologies',
        contactName: 'Nassim Lounadi',
        email: 'contact@salair.tech',
        phoneNumber: '+33612345678',
        address: "15 Rue de l'Innovation, 75001 Paris, France",
      },
      {
        userId: user.id,
        companyName: 'TechNova Solutions',
        contactName: 'Sophie Dupont',
        email: 'sophie@technova.fr',
        phoneNumber: '+33622334455',
        address: '42 Avenue des Champs-Élysées, 75008 Paris, France',
      },
      {
        userId: user.id,
        companyName: 'Digital Wave',
        contactName: 'Marc Bernard',
        email: 'marc@digitalwave.io',
        phoneNumber: '+33633445566',
        address: '8 Rue de la République, 69001 Lyon, France',
      },
      {
        userId: user.id,
        companyName: 'Innovatech',
        contactName: 'Julie Martin',
        email: 'julie@innovatech.com',
        phoneNumber: '+33644556677',
        address: '25 Boulevard des Capucines, 75002 Paris, France',
      },
      {
        userId: user.id,
        companyName: 'EcoSystems',
        contactName: 'Thomas Laurent',
        email: 'thomas@ecosystems.fr',
        phoneNumber: '+33655667788',
        address: '3 Quai des Belges, 13001 Marseille, France',
      },
    ]

    Customer.createMany(customers)

    console.log(
      `${customers.length} customers créés avec succès pour l'utilisateur nassim@mail.com`
    )
  }
}

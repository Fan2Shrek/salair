import BlogArticle from '#models/blog_article'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const user = await User.query().where('email', 'nassim@mail.com').firstOrFail()

    await BlogArticle.create({
      title: 'Comment créer une facture en autoentreprise ?',
      description:
        "Découvrez les étapes pour générer une facture conforme en tant qu'autoentrepreneur, avec les mentions obligatoires.",
      slug: 'facture-autoentrepreneur',
      visible: true,
      status: 'published',
      authorId: user.id,
      mainPicture: 'https://storage.salair.fr/salair/public/image-facture-autoentrepreneur.jpg',
    })

    await BlogArticle.create({
      title: 'Comment déclarer son chiffre d’affaires à l’URSSAF ?',
      description:
        "Déclarer son chiffre d'affaires à l'URSSAF est une obligation mensuelle ou trimestrielle pour les autoentrepreneurs. Voici comment faire simplement et éviter les erreurs.",
      slug: 'declaration-urssaf',
      visible: true,
      status: 'draft',
      authorId: user.id,
    })
  }
}

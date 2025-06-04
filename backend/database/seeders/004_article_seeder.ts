import BlogArticle from '#models/blog_article'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const user = await User.query().where('email', 'nassim@mail.com').firstOrFail()

    await BlogArticle.create({
      title: 'Facture autoentrepreneur',
      description: 'Description test',
      slug: 'facture-autoentrepreneur',
      visible: true,
      status: 'published',
      authorId: user.id,
      mainPicture: 'https://storage.salair.fr/salair/public/image-facture-autoentrepreneur.jpg',
    })
  }
}

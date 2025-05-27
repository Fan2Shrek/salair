import BlogArticle from '#models/blog_article'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await BlogArticle.create({
      slug: 'facture-autoentrepreneur',
      visible: true,
      status: 'published',
      authorId: 7,
      mainPicture: 'https://storage.salair.fr/salair/public/image-facture-autoentrepreneur.jpg',
    })
  }
}

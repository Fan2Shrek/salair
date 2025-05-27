import BlogArticle from '#models/blog_article'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await BlogArticle.create({
      slug: 'facture-autoentrepreneur',
      visible: true,
      status: 'published',
      authorId: 1,
    })
  }
}

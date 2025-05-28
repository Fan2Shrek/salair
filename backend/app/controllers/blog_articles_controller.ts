import BlogArticle from '#models/blog_article'
import { GithubService } from '#services/github_service'
import { blogArticleValidator } from '#validators/blog_article'
import type { HttpContext } from '@adonisjs/core/http'

export default class BlogArticlesController {
  async index({ request }: HttpContext) {
    const limit = request.input('limit', 10)
    const order = request.input('order', 'desc')

    const articles = await BlogArticle.query()
      .where('status', 'published')
      .orderBy('createdAt', order)
      .limit(limit)
      .preload('author', (authorQuery) => {
        authorQuery.select(['firstName', 'lastName', 'email'])
      })

    return articles
  }

  async files({}: HttpContext) {
    const files = await GithubService.listArticlesFiles()

    return files
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(blogArticleValidator)

    const user = auth.user!

    const blogArticle = await BlogArticle.create({
      slug: data.slug,
      visible: data.visible,
      status: data.status,
    })

    blogArticle.related('author').associate(user)
    blogArticle.save()

    return response.ok(blogArticle)
  }

  async show({ response, params }: HttpContext) {
    const slug = params.slug

    const article = await BlogArticle.query()
      .where('slug', slug)
      .where('status', 'published')
      .where('visible', true)
      .first()

    await article?.load('author')

    if (!article) {
      return response.badRequest({
        message: 'The requested article does not exist or is not published',
      })
    }

    return response.ok(article)
  }

  async slugs() {
    const slugs = await BlogArticle.query()
      .where('status', 'published')
      .where('visible', true)
      .select('slug')

    return slugs
  }
}

import BlogArticle from '#models/blog_article'
import { GithubService } from '#services/github_service'
import { blogArticleValidator } from '#validators/blog_article'
import type { HttpContext } from '@adonisjs/core/http'

export default class BlogArticlesController {
  async index({}: HttpContext) {
    const articles = await BlogArticle.query()
      .where('status', 'published')
      .select(['slug', 'status', 'visible'])

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

    console.log('Requesting article with slug:', slug)

    const article = await BlogArticle.query()
      .where('slug', slug)
      .where('status', 'published')
      .where('visible', true)
      .first()

    if (!article) {
      return response.badRequest({
        message: 'The requested article does not exist or is not published',
      })
    }

    return response.ok(article)
  }
}

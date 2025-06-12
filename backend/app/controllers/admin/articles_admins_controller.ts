import type { HttpContext } from '@adonisjs/core/http'
import BlogArticle from '#models/blog_article'
import { createArticleValidator } from '#validators/admin/article'

export default class ArticlesAdminsController {
  async index({ request }: HttpContext) {
    const limit = request.input('limit', 10)
    const page = request.input('page', 1)

    return await BlogArticle.query()
      .preload('author', (authorQuery) => {
        return authorQuery.select(['id', 'firstName', 'lastName', 'email'])
      })
      .paginate(page, limit)
  }

  async store({ request, response }: HttpContext) {
    const { slug, title, description } = await request.validateUsing(createArticleValidator)

    const article = await BlogArticle.create({
      slug,
      title,
      description,
    })

    return response.created(article)
  }

  async update({ request, response }: HttpContext) {
    const id = request.param('id')
    const data = request.only(['slug', 'title', 'description', 'status'])

    const article = await BlogArticle.find(id)

    if (!article) {
      return response.notFound()
    }

    article.merge(data)
    await article.save()

    return response.ok(article)
  }

  async delete({ request, response }: HttpContext) {
    const id = request.input('id', { required: true })

    const article = await BlogArticle.query().where('id', id).first()

    if (!article) {
      return response.notFound()
    }

    await article.delete()

    return response.noContent()
  }
}

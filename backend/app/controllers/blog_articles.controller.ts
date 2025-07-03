import BlogArticle from '#models/blog_article'
import { GithubService } from '#services/github.service'
import { parseFrontmatter } from '#utils/markdown'
import { blogArticleValidator } from '#validators/blog_article'
import type { HttpContext } from '@adonisjs/core/http'

export default class BlogArticlesController {
  async index({ request }: HttpContext) {
    const limit = request.input('limit', 10)
    const order = request.input('order', 'desc')

    return BlogArticle.query()
      .apply((scopes) => scopes.published())
      .orderBy('createdAt', order)
      .limit(limit)
      .preload('author', (authorQuery) => {
        authorQuery.select(['firstName', 'lastName', 'email'])
      })
  }

  async files({}: HttpContext) {
    return await GithubService.listArticlesFiles()
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(blogArticleValidator)
    const user = auth.user!

    const files = await GithubService.listArticlesFiles()
    if (!files.includes(data.slug)) {
      return response.notFound({ message: "We don't find the corresponding article" })
    }

    const fileName = `frontend/content/articles/${data.slug}.md`
    const fileContent = await GithubService.getFileContent(fileName)

    const frontmatter = parseFrontmatter(fileContent)

    const blogArticle = await BlogArticle.create({
      title: frontmatter.title,
      description: frontmatter.description,
      slug: data.slug,
      visible: data.visible,
      status: data.status,
      authorId: user.id,
    })

    return response.ok(blogArticle)
  }

  async show({ response, params }: HttpContext) {
    const slug = params.slug

    const article = await BlogArticle.query()
      .apply((scopes) => scopes.published())
      .where('slug', slug)
      .preload('author')
      .first()

    if (!article) {
      return response.notFound({
        message: 'The requested article does not exist or is not published',
      })
    }

    return response.ok(article)
  }

  async slugs() {
    return BlogArticle.query()
      .apply((scopes) => scopes.published())
      .select('slug')
  }
}

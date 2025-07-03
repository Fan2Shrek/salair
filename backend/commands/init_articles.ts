import BlogArticle from '#models/blog_article'
import User from '#models/user'
import { GithubService } from '#services/github.service'
import { parseFrontmatter } from '#utils/markdown'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class InitArticles extends BaseCommand {
  static commandName = 'init:articles'
  static description = ''

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const users = await User.query()
    const files = await GithubService.listArticlesFiles()

    const choices = users.map((user) => user.email)

    const choosenEmail = await this.prompt.autocomplete(
      'Select the author of the articles',
      choices
    )

    const author = users.find((user) => user.email === choosenEmail)

    if (!author) {
      return
    }

    for (const file of files) {
      const fileName = `frontend/content/articles/${file}.md`
      const fileContent = await GithubService.getFileContent(fileName)

      const frontmatter = parseFrontmatter(fileContent)

      const blogArticle = await BlogArticle.create({
        title: frontmatter.title,
        description: frontmatter.description,
        slug: file,
        visible: true,
        status: 'draft',
        authorId: author.id,
      })

      console.log(`${blogArticle.title} has been created.`)
    }
  }
}

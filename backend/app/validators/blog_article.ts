import vine from '@vinejs/vine'

export const blogArticleValidator = vine.compile(
  vine.object({
    slug: vine.string().unique(async (db, value) => {
      const match = await db.from('blog_articles').where('slug', value).first()

      return !match
    }),
    visible: vine.boolean(),
    status: vine.enum(['draft', 'published', 'archived']),
  })
)

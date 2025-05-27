import vine from '@vinejs/vine'

export const blogArticleValidator = vine.compile(
  vine.object({
    slug: vine.string(),
    visible: vine.boolean(),
    status: vine.enum(['draft', 'published', 'archived']),
  })
)

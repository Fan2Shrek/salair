import vine from '@vinejs/vine'

export const createArticleValidator = vine.compile(
  vine.object({
    slug: vine.string().minLength(3),
    title: vine.string().minLength(3),
    description: vine.string().minLength(3),
  })
)

import vine from '@vinejs/vine'

export const newsletterValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const match = await db
          .from('newsletter_subscribers')
          .select('id')
          .where('email', value)
          .first()

        return !match
      }),
  })
)

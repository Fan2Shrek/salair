import vine from '@vinejs/vine'

const password = vine.string().minLength(8)

export const registerValidator = vine.compile(
  vine.object({
    firstName: vine.string(),
    lastName: vine.string(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('email', value).first()

        return !match
      }),
    password,
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password,
  })
)

export const changePasswordValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .exists(async (db, value) => {
        const match = await db.from('users').select('id').where('email', value).first()

        return !match
      }),
    code: vine.string().fixedLength(6),
    password,
  })
)

export const verifyResetValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .exists(async (db, value) => {
        const match = await db.from('users').select('id').where('email', value).first()

        return !match
      }),
    code: vine.string().fixedLength(6),
  })
)

export const resetValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .exists(async (db, value) => {
        const match = await db.from('users').select('id').where('email', value).first()

        return !match
      }),
  })
)

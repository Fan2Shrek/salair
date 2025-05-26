import vine from '@vinejs/vine'

export const contactValidator = vine.compile(
  vine.object({
    firstName: vine.string(),
    lastName: vine.string(),
    email: vine.string().email().normalizeEmail(),
    phoneNumber: vine.string().optional(),
    message: vine.string(),
    isAgreeingPrivacy: vine.boolean(),
  })
)

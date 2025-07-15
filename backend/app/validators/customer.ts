import vine from '@vinejs/vine'

export const createCustomerValidator = vine.compile(
  vine.object({
    companyName: vine.string().minLength(1).maxLength(255),
    contactName: vine.string().minLength(1).maxLength(255),
    email: vine.string().email().normalizeEmail(),
    phoneNumber: vine.string().optional(),
    address: vine.string().optional(),
    siret: vine.string().optional(),
    vatNumber: vine.string().optional(),
    notes: vine.string().optional(),
  })
)

export const updateCustomerValidator = vine.compile(
  vine.object({
    companyName: vine.string().minLength(1).maxLength(255).optional(),
    contactName: vine.string().minLength(1).maxLength(255).optional(),
    email: vine.string().email().normalizeEmail().optional(),
    phoneNumber: vine.string().optional(),
    address: vine.string().optional(),
    siret: vine.string().optional(),
    vatNumber: vine.string().optional(),
    notes: vine.string().optional(),
  })
)

export const customerFilterValidator = vine.compile(
  vine.object({
    search: vine.string().optional(),
    status: vine.enum(['active', 'inactive']).optional(),
    hasInvoices: vine.boolean().optional(),
    createdAfter: vine.date().optional(),
    createdBefore: vine.date().optional(),
    page: vine.number().positive().optional(),
    limit: vine.number().positive().max(100).optional(),
    sortBy: vine.enum(['companyName', 'contactName', 'email', 'createdAt']).optional(),
    sortOrder: vine.enum(['asc', 'desc']).optional(),
  })
)

export const customerEnrichValidator = vine.compile(
  vine.object({
    siret: vine.string().minLength(14).maxLength(14),
  })
)

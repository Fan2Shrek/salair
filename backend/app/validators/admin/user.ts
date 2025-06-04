import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

function assignDefaultSortBy(value: unknown) {
  if (!value) {
    return 'created_at'
  }

  return value
}

function assignDefaultOrder(value: unknown) {
  if (!value) {
    return 'asc'
  }

  return value
}

export const filterParamsSchema = vine.compile(
  vine.object({
    email: vine.string().optional(),
    created_after: vine
      .date()
      .transform((date) => DateTime.fromJSDate(date))
      .optional(),
    created_before: vine
      .date()
      .transform((date) => DateTime.fromJSDate(date))
      .optional(),
    status: vine.enum(['active', 'inactive', 'suspended']).optional(),
    page: vine.number().withoutDecimals().min(1).optional(),
    limit: vine.number().withoutDecimals().min(1).max(100).optional(),
    sort_by: vine.enum(['created_at', 'email']).parse(assignDefaultSortBy),
    order: vine.enum(['asc', 'desc']).parse(assignDefaultOrder),
  })
)

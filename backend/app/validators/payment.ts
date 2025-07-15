import vine from '@vinejs/vine'

export const createPaymentValidator = vine.compile(
  vine.object({
    invoiceId: vine.string().uuid(),
    amount: vine.number().positive(),
    method: vine.enum(['stripe', 'bank_transfer', 'cash', 'check']),
    receivedAt: vine.date().optional(),
    notes: vine.string().optional(),
    stripePaymentIntentId: vine.string().optional(),
    stripeChargeId: vine.string().optional(),
  })
)

export const updatePaymentValidator = vine.compile(
  vine.object({
    amount: vine.number().positive().optional(),
    method: vine.enum(['stripe', 'bank_transfer', 'cash', 'check']).optional(),
    status: vine.enum(['pending', 'completed', 'failed', 'cancelled']).optional(),
    receivedAt: vine.date().optional(),
    notes: vine.string().optional(),
    stripePaymentIntentId: vine.string().optional(),
    stripeChargeId: vine.string().optional(),
  })
)

export const paymentStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(['pending', 'completed', 'failed', 'cancelled']),
  })
)

export const paymentFilterValidator = vine.compile(
  vine.object({
    invoiceId: vine.string().uuid().optional(),
    status: vine.enum(['pending', 'completed', 'failed', 'cancelled']).optional(),
    method: vine.enum(['stripe', 'bank_transfer', 'cash', 'check']).optional(),
    startDate: vine.date().optional(),
    endDate: vine.date().optional(),
    minAmount: vine.number().positive().optional(),
    maxAmount: vine.number().positive().optional(),
    search: vine.string().optional(),
    page: vine.number().positive().optional(),
    limit: vine.number().positive().max(100).optional(),
    sortBy: vine.enum(['amount', 'receivedAt', 'createdAt', 'method', 'status']).optional(),
    sortOrder: vine.enum(['asc', 'desc']).optional(),
  })
)

export const stripePaymentValidator = vine.compile(
  vine.object({
    paymentIntentId: vine.string(),
    chargeId: vine.string().optional(),
    amount: vine.number().positive(),
    currency: vine.string().fixedLength(3).optional(),
    metadata: vine
      .object({
        invoiceId: vine.string().uuid(),
        userId: vine.string().uuid(),
      })
      .optional(),
  })
)

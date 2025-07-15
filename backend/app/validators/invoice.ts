import vine from '@vinejs/vine'

export const createInvoiceValidator = vine.compile(
  vine.object({
    customerId: vine.string().uuid(),
    invoiceNumber: vine.string().minLength(1).maxLength(50),
    issueDate: vine.date(),
    dueDate: vine.date(),
    notes: vine.string().optional(),
    items: vine
      .array(
        vine.object({
          description: vine.string().minLength(1).maxLength(255),
          quantity: vine.number().positive(),
          unitPrice: vine.number().positive(),
          vatRate: vine.number().min(0).max(100).optional(),
        })
      )
      .minLength(1),
  })
)

export const updateInvoiceValidator = vine.compile(
  vine.object({
    customerId: vine.string().uuid().optional(),
    invoiceNumber: vine.string().minLength(1).maxLength(50).optional(),
    issueDate: vine.date().optional(),
    dueDate: vine.date().optional(),
    status: vine.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
    notes: vine.string().optional(),
    items: vine
      .array(
        vine.object({
          id: vine.string().uuid().optional(),
          description: vine.string().minLength(1).maxLength(255),
          quantity: vine.number().positive(),
          unitPrice: vine.number().positive(),
          vatRate: vine.number().min(0).max(100).optional(),
        })
      )
      .minLength(1)
      .optional(),
  })
)

export const invoiceStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
  })
)

export const invoiceFilterValidator = vine.compile(
  vine.object({
    status: vine.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
    customerId: vine.string().uuid().optional(),
    startDate: vine.date().optional(),
    endDate: vine.date().optional(),
    minAmount: vine.number().positive().optional(),
    maxAmount: vine.number().positive().optional(),
    search: vine.string().optional(),
    page: vine.number().positive().optional(),
    limit: vine.number().positive().max(100).optional(),
  })
)

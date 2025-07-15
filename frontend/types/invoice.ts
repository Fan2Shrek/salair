import type { Customer } from './customer'

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface Invoice {
    id: string
    userId: string
    customerId: string
    invoiceNumber: string
    issueDate: string
    dueDate: string
    status: InvoiceStatus
    totalHt: number
    totalTtc: number
    notes?: string
    pdfUrl?: string
    createdAt: string
    updatedAt: string
    deletedAt?: string
    customer?: Customer
    items?: InvoiceItem[]
}

export interface InvoiceItem {
    id: string
    invoiceId: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
    vatRate: number
    vatAmount: number
    createdAt: string
    updatedAt: string
}

export interface InvoiceFilters {
    status?: InvoiceStatus
    customerId?: string
    search?: string
    startDate?: string
    endDate?: string
}

export interface InvoiceStatistics {
    totalInvoices: number
    totalRevenue: number
    paidInvoices: number
    pendingInvoices: number
    overdueInvoices: number
    averageInvoiceValue: number
}


export interface InvoiceStatisticsResponseDto {
    data: {
        totalInvoices: number
        totalRevenue: number
        paidInvoices: number
        pendingInvoices: number
        overdueInvoices: number
        averageInvoiceValue: number
    }
}
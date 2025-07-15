import type { InvoiceFilters, InvoiceStatus } from "~/types/invoice"
import type { InvoicesResponseDto } from "~/types/dtos/invoices_response.dto"
import type { InvoiceResponseDto } from "~/types/dtos/invoice_response.dto"
import type { InvoiceStatisticsResponseDto } from "~/types/dtos/invoice_statistics_response.dto"

export const useInvoiceService = () => {
    const { $api } = useNuxtApp();

    const getInvoices = async (page: number = 1, limit: number = 20, filters: InvoiceFilters = {}) => {
        return await useAuthFetch<InvoicesResponseDto>($api('/api/invoices'), {
            method: 'GET',
            query: {
                page,
                limit,
                ...filters
            }
        })
    }

    const getInvoiceById = async (id: string) => {
        return await useAuthFetch<InvoiceResponseDto>($api(`/api/invoices/${id}`), {
            method: 'GET'
        })
    }

    const createInvoice = async (invoiceData: any) => {
        return await useAuthFetch<InvoiceResponseDto>($api('/api/invoices'), {
            method: 'POST',
            body: invoiceData
        })
    }

    const updateInvoice = async (id: string, invoiceData: any) => {
        return await useAuthFetch<InvoiceResponseDto>($api(`/api/invoices/${id}`), {
            method: 'PUT',
            body: invoiceData
        })
    }

    const deleteInvoice = async (id: string) => {
        return await useAuthFetch($api(`/api/invoices/${id}`), {
            method: 'DELETE'
        })
    }

    const updateInvoiceStatus = async (id: string, status: InvoiceStatus) => {
        return await useAuthFetch<InvoiceResponseDto>($api(`/api/invoices/${id}/status`), {
            method: 'PATCH',
            body: { status }
        })
    }

    const getInvoiceStatistics = async (filters: InvoiceFilters = {}) => {
        return await useAuthFetch<InvoiceStatisticsResponseDto>($api('/api/invoices/statistics'), {
            method: 'GET',
            query: filters
        })
    }

    const getOverdueInvoices = async () => {
        return await useAuthFetch<InvoicesResponseDto>($api('/api/invoices/overdue'), {
            method: 'GET'
        })
    }

    const getRecentInvoices = async (limit: number = 10) => {
        return await useAuthFetch<InvoicesResponseDto>($api('/api/invoices/recent'), {
            method: 'GET',
            query: { limit }
        })
    }

    const getInvoicesByCustomer = async (customerId: string) => {
        return await useAuthFetch<InvoicesResponseDto>($api(`/api/customers/${customerId}/invoices`), {
            method: 'GET'
        })
    }

    const exportInvoices = async (filters: InvoiceFilters = {}) => {
        return await useAuthFetch<InvoicesResponseDto>($api('/api/invoices/export'), {
            method: 'GET',
            query: filters
        })
    }

    return {
        getInvoices,
        getInvoiceById,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        updateInvoiceStatus,
        getInvoiceStatistics,
        getOverdueInvoices,
        getRecentInvoices,
        getInvoicesByCustomer,
        exportInvoices
    }
}
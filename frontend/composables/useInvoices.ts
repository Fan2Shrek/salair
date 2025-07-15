import { useInvoiceService } from "~/services/invoice.service"
import type { Invoice, InvoiceFilters, InvoiceStatus } from "~/types/invoice"
import type { InvoicesResponseDto } from "~/types/dtos/invoices_response.dto"
import type { InvoiceStatisticsResponseDto } from "~/types/dtos/invoice_statistics_response.dto"

export const useInvoices = () => {
    // Refs
    const invoices = ref<Invoice[]>([])
    const statistics = ref<InvoiceStatisticsResponseDto['data'] | null>(null)
    const isLoading = ref<boolean>(true)
    const pagination = ref({
        current: 1,
        total: 0,
        pages: 0,
        limit: 20
    })

    // Composables
    const toast = useToast()
    const { t } = useI18n()

    // Services
    const {
        getInvoices,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        updateInvoiceStatus,
        getInvoiceStatistics
    } = useInvoiceService()

    // Computed
    const invoicesCount = computed(() => invoices.value.length || 0)
    const hasInvoices = computed(() => invoicesCount.value > 0)

    // Functions
    const handleInvoicesResponse = ({ data, error }: { data: Ref<InvoicesResponseDto | null>, error: any }) => {
        if (data.value && !error.value) {
            invoices.value = data.value.data || []
            console.log(data.value)
            pagination.value = {
                current: data.value.meta?.currentPage || 1,
                total: data.value.meta?.total || 0,
                pages: data.value.meta?.lastPage || 1,
                limit: data.value.meta?.perPage || 20
            }
            return true
        } else if (error.value) {
            toast.error(t('invoices.toast.error_title'), t('invoices.toast.error_message'))
            return false
        }
        return false
    }

    const handleStatisticsResponse = ({ data, error }: { data: Ref<InvoiceStatisticsResponseDto | null>, error: any }) => {
        if (data.value && !error.value) {
            statistics.value = data.value.data
            return true
        } else if (error.value) {
            toast.error(t('invoices.toast.error_title'), t('invoices.toast.stats_error'))
            return false
        }
        return false
    }

    const fetchInvoices = async (page: number = 1, filters: InvoiceFilters = {}) => {
        isLoading.value = true

        try {
            const response = await getInvoices(page, pagination.value.limit, filters)
            handleInvoicesResponse(response)
        } catch (error) {
            toast.error(t('invoices.toast.error_title'), t('invoices.toast.network_error'))
            console.error('Error fetching invoices:', error)
        } finally {
            isLoading.value = false
        }
    }

    const fetchInvoiceStatistics = async (filters: InvoiceFilters = {}) => {
        try {
            const response = await getInvoiceStatistics(filters)
            handleStatisticsResponse(response)
        } catch (error) {
            console.error('Error fetching invoice statistics:', error)
        }
    }

    const fetchInvoicesData = async (page: number = 1, filters: InvoiceFilters = {}) => {
        await Promise.all([
            fetchInvoices(page, filters),
            fetchInvoiceStatistics(filters)
        ])
    }

    const refreshInvoices = async () => {
        await fetchInvoicesData(pagination.value.current)
    }

    const deleteInvoiceById = async (id: string) => {
        try {
            const { error } = await deleteInvoice(id)

            if (!error.value) {
                toast.success(
                    t('invoices.toast.delete_success_title'),
                    t('invoices.toast.delete_success_message')
                )
                await refreshInvoices()
            } else {
                toast.error(
                    t('invoices.toast.delete_error_title'),
                    t('invoices.toast.delete_error_message')
                )
            }
        } catch {
            toast.error(t('invoices.toast.error_title'), t('invoices.toast.network_error'))
        }
    }

    const updateInvoiceStatusById = async (id: string, status: InvoiceStatus) => {
        try {
            const { error } = await updateInvoiceStatus(id, status)

            if (!error.value) {
                toast.success(
                    t('invoices.toast.status_update_success_title'),
                    t('invoices.toast.status_update_success_message')
                )
                await refreshInvoices()
            } else {
                toast.error(
                    t('invoices.toast.status_update_error_title'),
                    t('invoices.toast.status_update_error_message')
                )
            }
        } catch {
            toast.error(t('invoices.toast.error_title'), t('invoices.toast.network_error'))
        }
    }

    const createNewInvoice = async (invoiceData: any) => {
        try {
            const { error } = await createInvoice(invoiceData)

            if (!error.value) {
                toast.success(
                    t('invoices.toast.create_success_title'),
                    t('invoices.toast.create_success_message')
                )
                await refreshInvoices()
                return true
            } else {
                toast.error(
                    t('invoices.toast.create_error_title'),
                    t('invoices.toast.create_error_message')
                )
                return false
            }
        } catch {
            toast.error(t('invoices.toast.error_title'), t('invoices.toast.network_error'))
            return false
        }
    }

    const updateInvoiceById = async (id: string, invoiceData: any) => {
        try {
            const { error } = await updateInvoice(id, invoiceData)

            if (!error.value) {
                toast.success(
                    t('invoices.toast.update_success_title'),
                    t('invoices.toast.update_success_message')
                )
                await refreshInvoices()
                return true
            } else {
                toast.error(
                    t('invoices.toast.update_error_title'),
                    t('invoices.toast.update_error_message')
                )
                return false
            }
        } catch {
            toast.error(t('invoices.toast.error_title'), t('invoices.toast.network_error'))
            return false
        }
    }

    const getStatusColor = (status: InvoiceStatus) => {
        switch (status) {
            case 'draft':
                return 'brand'
            case 'sent':
                return 'brand'
            case 'paid':
                return 'success'
            case 'overdue':
                return 'error'
            case 'cancelled':
                return 'error'
            default:
                return 'brand'
        }
    }

    const getStatusLabel = (status: InvoiceStatus): string => {
        switch (status) {
            case 'draft':
                return t('invoices.status.draft')
            case 'sent':
                return t('invoices.status.sent')
            case 'paid':
                return t('invoices.status.paid')
            case 'overdue':
                return t('invoices.status.overdue')
            case 'cancelled':
                return t('invoices.status.cancelled')
            default:
                return status
        }
    }

    const formatAmount = (amount: number): string => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount)
    }

    const formatDate = (date: string): string => {
        return new Date(date).toLocaleDateString('fr-FR')
    }

    return {
        // Refs
        invoices,
        statistics,
        isLoading,
        pagination,
        invoicesCount,
        hasInvoices,

        // Functions
        fetchInvoicesData,
        fetchInvoices,
        fetchInvoiceStatistics,
        refreshInvoices,
        deleteInvoiceById,
        updateInvoiceStatusById,
        createNewInvoice,
        updateInvoiceById,
        getStatusColor,
        getStatusLabel,
        formatAmount,
        formatDate
    }
}
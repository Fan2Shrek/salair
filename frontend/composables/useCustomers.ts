import { useCustomerService } from "~/services/customer.service"
import type { Customer } from "~/types/customer"

export const useCustomers = () => {
    // Refs
    const customers = ref<Customer[]>([])
    const isLoading = ref<boolean>(true)

    // Composables
    const toast = useToast();
    const { t } = useI18n();

    // Computed
    const customersCount = computed(() => customers.value.length || 0)

    // Services
    const { getCustomers } = useCustomerService();

    // Functions
    const fetchCustomers = async () => {
        isLoading.value = true

        try {
            const { data, error } = await getCustomers();

            if (data.value && !error.value) {
                customers.value = data.value.data
            } else if (error.value) {
                toast.error(t('customers.toast.error_title'), t('customers.toast.error_message'))
            }
        } catch {
            toast.error(t('customers.toast.error_title'), t('customers.toast.network_error'))
        } finally {
            isLoading.value = false
        }
    }


    return {
        // Refs
        isLoading,
        customers,
        customersCount,

        // Functions
        fetchCustomers
    }
}
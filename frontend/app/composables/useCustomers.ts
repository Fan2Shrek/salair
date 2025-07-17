import { useCustomerService } from "~/services/customer.service"
import type { Customer } from "~/types/customer"
import type { CustomersInsight } from "~/types/customers_insight"

export const useCustomers = () => {
    // Refs
    const customers = ref<Customer[]>([])
    const customerInsights = ref<CustomersInsight[]>([])
    const isLoading = ref<boolean>(true)

    // Composables
    const toast = useToast();
    const { t } = useI18n();

    // Services
    const { getCustomers, getCustomersInsights, removeCustomer } = useCustomerService();

    // Computed
    const customersCount = computed(() => customers.value.length || 0)

    // Functions
    const handleCustomersResponse = ({ data, error }: { data: any, error: any }) => {
        if (data.value && !error.value) {
            customers.value = data.value.data;
            return true;
        } else if (error.value) {
            toast.error(t('customers.toast.error_title'), t('customers.toast.error_message'));
            return false;
        }
        return false;
    }

    const handleInsightsResponse = ({ data, error }: { data: any, error: any }) => {
        if (data.value && !error.value) {
            customerInsights.value = data.value.data;
            return true;
        } else if (error.value) {
            toast.error(t('customers.toast.error_title'), t('customers.toast.insights_error'));
            return false;
        }
        return false;
    }

    const fetchCustomersData = async () => {
        isLoading.value = true;

        try {
            const [customersResponse, insightsResponse] = await Promise.all([
                getCustomers(),
                getCustomersInsights()
            ]);

            handleCustomersResponse(customersResponse);
            handleInsightsResponse(insightsResponse);
        } catch (error) {
            toast.error(t('customers.toast.error_title'), t('customers.toast.network_error'));
            console.error('Error fetching customer data:', error);
        } finally {
            isLoading.value = false;
        }
    }

    const deleteCustomer = async (id: string) => {
        try {
            const { error } = await removeCustomer(id);

            if (!error.value) {
                toast.success(
                    t('customers.toast.delete_success_title'), 
                    t('customers.toast.delete_success_message')
                )
                await fetchCustomersData();
            } else if (error.value) {
                toast.error(
                    t('customers.toast.delete_error_title'), 
                    t('customers.toast.delete_error_message')
                )
            }
        } catch {
            toast.error(t('customers.toast.error_title'), t('customers.toast.network_error'))
        }
    }

    return {
        // Refs
        isLoading,
        customers,
        customerInsights,
        customersCount,

        // Functions
        fetchCustomersData,
        deleteCustomer
    }
}
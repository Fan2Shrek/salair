import type { CustomersInsightsResponseDto } from "~/types/dtos/customers_insights_response.dto";
import type { CustomersResponseDto } from "~/types/dtos/customers_response.dto";

export const useCustomerService = () => {
    const { $api } = useNuxtApp();

    const getCustomers = async () => {
        return await useAuthFetch<CustomersResponseDto>($api('/api/customers'), {
            method: 'GET'
        })
    }

    const getCustomersInsights = async () => {
        return await useAuthFetch<CustomersInsightsResponseDto>($api('/api/customers/insights'), {
            method: 'GET'
        })
    }

    const removeCustomer = async (id: string) => {
        return await useAuthFetch($api(`/api/customers/${id}`), {
            method: 'DELETE',
        })
    }

    return {
        getCustomers,
        getCustomersInsights,
        removeCustomer
    }
}
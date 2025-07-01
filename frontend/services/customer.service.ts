import type { CustomersResponseDto } from "~/types/dtos/customers_response.dto";

export const useCustomerService = () => {
    const { $api } = useNuxtApp();

    const getCustomers = async () => {
        return await useAuthFetch<CustomersResponseDto>($api('/api/customers'), {
            method: 'GET'
        })
    }

    return {
        getCustomers
    }
}
import type { CustomersEnrichResponseDto } from "~/types/dtos/customers_enrich_response.dto"

export const useCustomerCreation = () => {
    // Refs
    const isCreationModalOpen = ref<boolean>(false)
    const siren = ref<string>("")
    const foundedCompany = ref<CustomersEnrichResponseDto | null>(null)
    const isSearching = ref<boolean>(false)
    const searchError = ref<string | null>(null)
    const maxSirenLength = 9

    // Composables
    const toast = useToast()
    const { t } = useI18n()
    const { $api } = useNuxtApp()

    // Computed
    const isSirenValid = computed(() => {
        return siren.value.length === maxSirenLength && /^\d+$/.test(siren.value)
    })

    // Reset form data
    const resetForm = () => {
        siren.value = ""
        foundedCompany.value = null
        searchError.value = null
    }

    // Open modal
    const openCreationModal = () => {
        resetForm()
        isCreationModalOpen.value = true
    }

    // Close modal
    const closeCreationModal = () => {
        isCreationModalOpen.value = false
        resetForm()
    }

    // Handle SIREN input
    const handleSirenInput = (value: string) => {
        // Ensure only digits and limit to 9 characters
        const digitsOnly = value.replace(/\D/g, "").substring(0, maxSirenLength)
        siren.value = digitsOnly
        
        // Clear previous results if input changes
        if (foundedCompany.value && siren.value.length !== maxSirenLength) {
            foundedCompany.value = null
            searchError.value = null
        }
    }

    // Search company by SIREN
    const searchCompanyBySiren = async () => {
        if (!isSirenValid.value) return

        searchError.value = null
        isSearching.value = true

        try {
            const { data, error } = await useAuthFetch<CustomersEnrichResponseDto>($api("/api/customers/enrich"), {
                method: "POST",
                body: {
                    siren: siren.value,
                },
            })

            if (data.value && !error.value) {
                foundedCompany.value = data.value
            } else if (error.value) {
                searchError.value = t("customers.creation.company_not_found")
                foundedCompany.value = null
            }
        } catch (e) {
            console.error("Error searching company:", e)
            searchError.value = t("customers.creation.search_error")
        } finally {
            isSearching.value = false
        }
    }

    // Create customer from found company
    const createCustomer = async () => {
        // To be implemented when the backend endpoint is ready
        // This would save the new customer to the database
        toast.success(t("customers.toast.create_success_title"), t("customers.toast.create_success_message"))
        closeCreationModal()
    }

    // Watch for SIREN changes and trigger search when valid
    watch(() => siren.value, (newVal) => {
        if (newVal.length === maxSirenLength) {
            searchCompanyBySiren()
        }
    })

    return {
        // Refs
        isCreationModalOpen,
        siren,
        foundedCompany,
        isSearching,
        searchError,
        maxSirenLength,
        
        // Computed
        isSirenValid,
        
        // Functions
        openCreationModal,
        closeCreationModal,
        handleSirenInput,
        searchCompanyBySiren,
        createCustomer,
    }
}

export function useNewsletter() {
    const { error: toastError, success: toastSuccess } = useToast();
    const { t } = useI18n();

    const email = ref<string>()
    const isLoading = ref<boolean>(false)

    const validateForm = () => {
        if (!email.value) return false
        return true
    }

    const handleFormSubmit = async () => {
        if (!validateForm()) {
            toastError(t('newsletter.validation_error'), '')
            return;
        }
        
        isLoading.value = true

        try {
            const { $api } = useNuxtApp()

            const { data, error } = await useAuthFetch($api('/api/newsletter'), {
                method: 'POST',
                body: {
                    email: email.value
                }
            })

            if (data.value && !error.value) {
                toastSuccess(t('newsletter.success'), '')
                resetForm();
            } else {
                toastError(t('newsletter.error'), '')
            }
        } catch {
            toastError(t('newsletter.network_error'), '')
        } finally {
            isLoading.value = false
        }
    }

    const resetForm = () => {
        email.value = ''
    }
    
    return {
        email,
        isLoading,
        handleFormSubmit,
    }
}
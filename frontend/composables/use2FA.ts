interface Generate2FADto {
    qrCodeDataUrl: string
    secret: string
}

export const use2FA = () => {
    // Composables
    const authStore = useAuthStore();
    const { $api } = useNuxtApp();
    const toast = useToast();

    // Computed
    const user = computed(() => authStore.user)

    // Refs
    const qrCodeDataUrl = ref<string>()
    const showQrCodeModal = ref<boolean>(false);
    const isLoading = ref<boolean>(false);
    const verificationToken = ref<string>();
    
    const setup2FA = async () => {
        isLoading.value = true
        try {
            const { data, error } = await useAuthFetch<Generate2FADto>($api('/api/2fa/generate'), {
                method: 'POST'
            });

            if (data.value && !error.value) {
                qrCodeDataUrl.value = data.value.qrCodeDataUrl
                showQrCodeModal.value = true
            } else if (error.value) {
                toast.error('Unable to generate secret for 2FA', '')
            }
        } catch {
            toast.error('An error occured', 'Unable to get data from API')
        } finally {
            isLoading.value = false
        }
    }

    const enable = async () => {
        try {
            const { data, error } = await useAuthFetch($api('/api/2fa/enable'), {
                method: 'POST',
                body: {
                    token: verificationToken
                }
            })

            if (data.value && !error.value) {
                toast.success('2FA is correctly enabled', '')
                showQrCodeModal.value = false

                await authStore.fetchUser();
            } else if (error.value) {
                toast.error('The 2FA token is incorrect', '')
            }
        } catch {
            toast.error('An error occured', 'An error occured while enabling 2FA')
        }
    }

    return {
        // Refs
        user,
        isLoading,
        showQrCodeModal,
        qrCodeDataUrl,
        verificationToken,

        // Methods
        setup2FA,
        enable
    }
};

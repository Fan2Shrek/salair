import type User from '~/types/user';

export const useSettings = () => {
    const authStore = useAuthStore();
    const { error: toastError, success: toastSuccess } = useToast();
    const { upload, isSuccess, responseData } = useFileUploadProgress();
    const { $api } = useNuxtApp();
    const { t } = useI18n();

    // Refs
    const firstName = ref<string>(authStore.user?.firstName || '');
    const lastName = ref<string>(authStore.user?.lastName || '');
    const email = ref<string>(authStore.user?.email || '');
    const avatar = ref<File>();

    // Computed
    const isSaveable = computed(() => {
        if (firstName.value !== authStore.user?.firstName) return true;
        if (lastName.value !== authStore.user?.lastName) return true;
        if (email.value !== authStore.user.email) return true;
        if (avatar.value) return true;

        return false;
    });

    // Methods
    function handleUpload(file: File | null) {
        if (file) {
            if (!file.type.startsWith('image/')) {
                toastError(t('general.error'), t('onboarding.billing.form.logo.errors.invalid_image'));
                return;
            }

            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                toastError(t('general.error'), t('onboarding.billing.form.logo.errors.file_too_large'));
                return;
            }

            avatar.value = file;
        }
    }

    async function handleSaveDetails() {
        if (!isSaveable.value) return;

        if (
            firstName.value !== authStore.user?.firstName ||
            lastName.value !== authStore.user?.lastName ||
            email.value !== authStore.user?.email
        ) {
            const payload = {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
            };

            const { data, error } = await useAuthFetch<User>($api('/api/me'), {
                method: 'PUT',
                body: payload,
            });

            if (data.value && !error.value) {
                toastSuccess('Bravo!', 'Votre profil a bien été mis à jour !');

                authStore.user = data.value;
            }
        }

        if (avatar.value) {
            await upload(avatar.value, $api(`/api/me/avatar`));

            if (isSuccess.value && responseData.value) {
                authStore.user!.avatar = responseData.value.avatar_url as string;
            }
        }
    }

    async function handleSaveAppearance() {}

    return {
        // Refs
        firstName,
        lastName,
        email,
        avatar,
        
        // Computed
        isSaveable,
        
        // Methods
        handleUpload,
        handleSaveDetails,
        handleSaveAppearance,
    };
};

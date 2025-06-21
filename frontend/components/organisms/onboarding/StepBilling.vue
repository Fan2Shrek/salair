<script setup lang="ts">
    import type Company from '~/types/company';

    interface StepBillingProps {
        nextStep?: () => void;
    }

    const onboardingStore = useOnboardingStore();
    const _props = defineProps<StepBillingProps>();
    const selectedBillingType = ref<string>();
    const selectedCurrency = ref<string>();
    const defaultNote = ref<string>(onboardingStore.company.defaultInvoiceNote || '');
    const logo = ref<File>();
    const { upload, isSuccess, responseData } = useFileUploadProgress();
    const { $api } = useNuxtApp();
    const { error: toastError, success: toastSuccess } = useToast();
    const authStore = useAuthStore();
    const { t } = useI18n();

    const isLoading = ref<boolean>(false);

    const billingTypeOptions = computed(() => [
        {
            label: t('onboarding.billing.billing_type_options.ht.label'),
            value: 'ht',
            description: t('onboarding.billing.billing_type_options.ht.description'),
        },
        {
            label: t('onboarding.billing.billing_type_options.ttc.label'),
            value: 'ttc',
            description: t('onboarding.billing.billing_type_options.ttc.description'),
        },
    ]);

    const currencyOptions = [
        {
            label: 'EUR',
            value: 'EUR',
        },
        {
            label: 'USD',
            value: 'USD',
        },
    ];

    async function handleNextStep() {
        if (!selectedBillingType.value) {
            toastError(t('general.error'), t('onboarding.billing.form.errors.select_billing_type'));
            return;
        }
        
        if (!selectedCurrency.value) {
            toastError(t('general.error'), t('onboarding.billing.form.errors.select_currency'));
            return;
        }

        isLoading.value = true;

        try {
            const companyData = {
                siret: onboardingStore.company.siret,
                activity: onboardingStore.company.activity,
                tradeName: onboardingStore.company.tradeName,
                urssafFrequency: onboardingStore.company.urssafFrequency,
                businessStartDate: onboardingStore.company.businessStartDate,
                isVatPayer: onboardingStore.company.isVatPayer,
                billingType: selectedBillingType.value,
                currency: selectedCurrency.value,
                defaultDueDays: onboardingStore.company.defaultDueDays || 0,
                defaultInvoiceNote: defaultNote.value || onboardingStore.company.defaultInvoiceNote || '',
            };

            const { data, error } = await useAuthFetch<Company>($api('/api/companies'), {
                method: 'POST',
                body: companyData,
            });

            if (error.value) {
                toastError(t('general.error'), t('onboarding.billing.form.errors.company_creation_error'));
                isLoading.value = false;
                return;
            }

            if (data.value && !error.value) {
                onboardingStore.company.id = data.value.id;
                authStore.user!.company = data.value;
            } else {
                throw new Error(t('onboarding.billing.form.errors.unexpected_error'));
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'entreprise:', error);
            toastError(t('general.error'), t('onboarding.billing.form.errors.unexpected_error'));
            isLoading.value = false;
            return;
        }

        try {
            // Only upload the logo if it's set and the UFileInput hasn't already uploaded it
            // This is a fallback for when the UFileInput doesn't have an uploadUrl (which happens before company ID is set)
            if (logo.value && !authStore.user?.company?.logoUrl) {
                await upload(logo.value, $api(`/api/companies/${onboardingStore.company.id}/logo`));
                
                if (isSuccess.value && responseData.value) {
                    toastSuccess(t('onboarding.billing.form.logo.upload_success'), responseData.value.logoUrl);
                    authStore.user!.company!.logoUrl = responseData.value.logoUrl as string;
                }
            }
            
            isLoading.value = false;
            navigateTo('/app/dashboard');
        } catch (error) {
            console.error('Erreur lors du téléchargement du logo:', error);
            isLoading.value = false;
            toastError(t('general.error'), t('onboarding.billing.form.errors.logo_upload_error'));
        }
    }

    const handleFileUpload = (file: File | null) => {
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
            
            logo.value = file;
        }
    };
    
    const handleUploadSuccess = (event: { file: File, response: any }) => {
        if (event.response && event.response.logoUrl) {
            toastSuccess(t('onboarding.billing.form.logo.upload_success'), event.response.logoUrl);
            if (authStore.user?.company) {
                authStore.user.company.logoUrl = event.response.logoUrl;
            }
        }
    };
    
    const handleUploadError = (_event: { file: File, error: any }) => {
        toastError(t('general.error'), t('onboarding.billing.form.logo.errors.logo_upload_error'));
    };
</script>

<template>
    <div class="bg-primary p-3.5 rounded-xl border border-primary shadow-xs h-fit w-fit mx-auto relative">
        <ReceiptCheckIcon class="text-fg-secondary size-7" />
    </div>
    <h2 class="font-semibold text-primary text-3xl mt-8 text-center relative">{{ t('onboarding.billing.title') }}</h2>
    <p class="text-tertiary text-center mt-3 relative max-w-90 mx-auto">
        {{ t('onboarding.billing.subtitle') }}
    </p>
    <div class="mt-8 relative max-w-5xl mx-auto w-full">
        <URadioGroup v-model="selectedBillingType" :items="billingTypeOptions" />
        <div class="mt-5 space-y-5">
            <USelectBox
                v-model="selectedCurrency"
                :label="t('onboarding.billing.form.currency.label')"
                :placeholder="t('onboarding.billing.form.currency.placeholder')"
                :options="currencyOptions"
                required
            />
            <UInput
                v-model="defaultNote"
                type="text"
                :label="t('onboarding.billing.form.default_note.label')"
                :placeholder="t('onboarding.billing.form.default_note.placeholder')"
            />
            <UFileInput 
                :label="t('onboarding.billing.form.logo.label')" 
                :upload-url="onboardingStore.company.id ? $api(`/api/companies/${onboardingStore.company.id}/logo`) : ''"
                @update:file="handleFileUpload"
                @upload:success="handleUploadSuccess"
                @upload:error="handleUploadError"
            />
        </div>
    </div>
    <UButton :disabled="isLoading" class="w-full mt-6" @click="handleNextStep">{{ t('general.continue') }}</UButton>
</template>


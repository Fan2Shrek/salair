<script setup lang="ts">
    import type Company from '~/types/company';

    interface StepBillingProps {
        nextStep?: () => void;
    }

    const onboardingStore = useOnboardingStore();
    const _props = defineProps<StepBillingProps>();
    const selectedBillingType = ref<string>();
    const selectedCurrency = ref<string>();
    const defaultNote = ref<string>();
    const logo = ref<File>();
    const { upload, isSuccess } = useFileUploadProgress();
    const { $api } = useNuxtApp();
    const { error: toastError, success: toastSuccess } = useToast();
    const authStore = useAuthStore();

    const isLoading = ref<boolean>(false);

    const billingTypeOptions = [
        {
            label: 'HT',
            value: 'ht',
            description: 'Pour les assujettis à la TVA',
        },
        {
            label: 'TTC',
            value: 'ttc',
            description: 'Pour les auto-entrepreneurs non redevables',
        },
    ];

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
        if (!selectedBillingType.value) return;
        if (!selectedCurrency.value) return;

        isLoading.value = true;

        try {
            console.log('Sending values', {
                siret: onboardingStore.company.siret,
                activity: onboardingStore.company.activity,
                tradeName: onboardingStore.company.tradeName,
                urssafFrequency: onboardingStore.company.urssafFrequency,
                businessStartDate: onboardingStore.company.businessStartDate,
                isVatPayer: onboardingStore.company.isVatPayer,
                billingType: selectedBillingType.value,
                currency: selectedCurrency.value,
                defaultDueDays: onboardingStore.company.defaultDueDays || 0,
                defaultInvoiceNote: onboardingStore.company.defaultInvoiceNote || '',
            });

            const { data, error } = await useAuthFetch<Company>($api('/api/companies'), {
                method: 'POST',
                body: {
                    siret: onboardingStore.company.siret,
                    activity: onboardingStore.company.activity,
                    tradeName: onboardingStore.company.tradeName,
                    urssafFrequency: onboardingStore.company.urssafFrequency,
                    businessStartDate: onboardingStore.company.businessStartDate,
                    isVatPayer: onboardingStore.company.isVatPayer,
                    billingType: selectedBillingType.value,
                    currency: selectedCurrency.value,
                    defaultDueDays: onboardingStore.company.defaultDueDays,
                    defaultInvoiceNote: onboardingStore.company.defaultInvoiceNote,
                },
            });

            if (error.value) {
                toastError('An error occured while creating company', error.value.message);
            }

            if (data.value && !error.value) {
                onboardingStore.company.id = data.value.id;

                authStore.user!.company = data.value
            }
        } catch {
            console.error('error');
            return;
        }

        if (logo.value) {
            upload(logo.value, $api(`/api/companies/${onboardingStore.company.id}/logo`));

            if (isSuccess) {
                toastSuccess('Logo uploadé', '');
                isLoading.value = false;
                navigateTo('/app/dashboard')
            } else {
                return;
            }
        } else {
            isLoading.value = false;
            navigateTo('/app/dashboard')
        }
    }

    const handleFileUpload = (file: File) => {
        logo.value = file;
    };
</script>

<template>
    <div class="bg-primary p-3.5 rounded-xl border border-primary shadow-xs h-fit w-fit mx-auto relative">
        <ReceiptCheckIcon class="text-fg-secondary size-7" />
    </div>
    <h2 class="font-semibold text-primary text-3xl mt-8 text-center relative">Préférences de facturation</h2>
    <p class="text-tertiary text-center mt-3 relative max-w-90 mx-auto">
        Configurez vos premières préférences de facturation
    </p>
    <div class="mt-8 relative max-w-5xl mx-auto w-full">
        <URadioGroup v-model="selectedBillingType" :items="billingTypeOptions" />
        <div class="mt-5 space-y-5">
            <USelectBox
                v-model="selectedCurrency"
                label="Devise par défaut"
                placeholder="Choisir votre devise par défaut"
                :options="currencyOptions"
                required
            />
            <UInput
                v-model="defaultNote"
                type="text"
                label="Note par défaut"
                placeholder="Merci pour votre confiance. Paiement à effectuer sous 30 jours."
            />
            <UFileInput @update:file="handleFileUpload" />
        </div>
    </div>
    <UButton :disabled="isLoading" class="w-full mt-6" @click="handleNextStep">Continuer</UButton>
</template>


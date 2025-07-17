<script setup lang="ts">
    interface StepUrssafProps {
        nextStep?: () => void;
    }

    const props = defineProps<StepUrssafProps>();
    const onboardingStore = useOnboardingStore();
    const { t } = useI18n();
    const selectedFrequency = ref<string>(onboardingStore.company.urssafFrequency || '');
    const businessStartDate = ref(new Date(Date.parse(onboardingStore.company.businessStartDate || new Date().toString())));
    const isVatPayer = ref<boolean>(onboardingStore.company.isVatPayer || false);

    const frequencyOptions = computed(() => [
        {
            label: t('onboarding.urssaf.frequency_options.monthly.label'),
            value: 'monthly',
            description: t('onboarding.urssaf.frequency_options.monthly.description'),
        },
        {
            label: t('onboarding.urssaf.frequency_options.quarterly.label'),
            value: 'quarterly',
            description: t('onboarding.urssaf.frequency_options.quarterly.description'),
        },
        {
            label: t('onboarding.urssaf.frequency_options.unknown.label'),
            value: 'unknown',
            description: t('onboarding.urssaf.frequency_options.unknown.description'),
        },
    ]);

    function handleNextStep() {
        if (!selectedFrequency.value) return
        if (!businessStartDate.value) return
        
        onboardingStore.company.businessStartDate = businessStartDate.value.toISOString()
        onboardingStore.company.urssafFrequency = selectedFrequency.value
        onboardingStore.company.isVatPayer = isVatPayer.value

        if (props.nextStep) {
            props.nextStep()
        }
    }
</script>

<template>
    <div class="bg-primary p-3.5 rounded-xl border border-primary shadow-xs h-fit w-fit mx-auto relative">
        <CalendarIcon class="text-fg-secondary size-7" />
    </div>
    <h2 class="font-semibold text-primary text-3xl mt-8 text-center relative">{{ t('onboarding.urssaf.title') }}</h2>
    <p class="text-tertiary text-center mt-3 relative max-w-90 mx-auto">{{ t('onboarding.urssaf.subtitle') }}</p>
    <Transition name="slide-fade">
        <div v-if="!selectedFrequency" class="mt-8 relative max-w-5xl mx-auto w-full">
            <URadioGroup v-model="selectedFrequency" :items="frequencyOptions" />
        </div>
    </Transition>
    <Transition name="slide-fade">
        <div v-if="selectedFrequency" class="mt-8 relative max-w-5xl mx-auto w-full space-y-5">
            <UDatePicker v-model="businessStartDate" :label="t('onboarding.urssaf.form.business_start_date.label')" />
            <USwitch v-model="isVatPayer" :label="t('onboarding.urssaf.form.is_vat_payer.label')" />
        </div>
    </Transition>
    <UButton v-if="selectedFrequency" class="w-full mt-6 relative" @click="handleNextStep">{{ t('general.continue') }}</UButton>
</template>

<style scoped>
    .slide-fade-enter-active {
        transition: all 0.3s ease-out;
        width: inherit;
    }

    .slide-fade-leave-active {
        transition: all 0.2s ease-in;
        width: inherit;
    }

    .slide-fade-enter-from {
        transform: translateY(-20px);
        opacity: 0;
        width: inherit;
    }

    .slide-fade-leave-to {
        transform: translateY(-20px);
        opacity: 0;
        width: inherit;
    }
</style>


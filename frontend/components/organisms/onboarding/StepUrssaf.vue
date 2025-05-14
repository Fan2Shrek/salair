<script setup lang="ts">
    interface StepUrssafProps {
        nextStep?: () => void;
    }

    const props = defineProps<StepUrssafProps>();
    const onboardingStore = useOnboardingStore();
    const selectedFrequency = ref<string>(onboardingStore.company.urssafFrequency || '');
    const businessStartDate = ref(new Date(Date.parse(onboardingStore.company.businessStartDate || new Date().toString())));
    const isVatPayer = ref<boolean>(onboardingStore.company.isVatPayer || false);

    const frequencyOptions = [
        {
            label: 'Mensuelle',
            value: 'monthly',
            description: 'Je déclare tous les mois',
        },
        {
            label: 'Trimestrielle',
            value: 'quarterly',
            description: 'Tous les 3 mois',
        },
        {
            label: 'Je ne sais pas',
            value: 'unknown',
            description: 'Je veux être guidé(e) plus tard',
        },
    ];

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
    <h2 class="font-semibold text-primary text-3xl mt-8 text-center relative">Déclarations URSSAF</h2>
    <p class="text-tertiary text-center mt-3 relative max-w-90 mx-auto">Indiquez la fréquence de vos déclarations</p>
    <Transition name="slide-fade">
        <div v-if="!selectedFrequency" class="mt-8 relative max-w-5xl mx-auto w-full">
            <URadioGroup v-model="selectedFrequency" :items="frequencyOptions" />
        </div>
    </Transition>
    <Transition name="slide-fade">
        <div v-if="selectedFrequency" class="mt-8 relative max-w-5xl mx-auto w-full space-y-5">
            <UDatePicker v-model="businessStartDate" label="Date de début d'activité" />
            <USwitch v-model="isVatPayer" label="Êtes vous assujetti à la TVA ?" />
        </div>
    </Transition>
    <UButton v-if="selectedFrequency" class="w-full mt-6 relative" @click="handleNextStep">Continuer</UButton>
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


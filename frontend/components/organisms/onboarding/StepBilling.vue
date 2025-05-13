<script setup lang="ts">
    interface StepBillingProps {
        nextStep?: () => void;
    }

    const props = defineProps<StepBillingProps>();
    const selectedBillingType = ref<string>();
    const selectedCurrency = ref<string>();
    const defaultNote = ref<string>();

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

    function handleNextStep() {
        if (props.nextStep) {
            props.nextStep();
        }
    }

    const handleFileUpload = (file: File) => {
        console.log('Fichier sélectionné:', file);
        // Traitez le fichier ici
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
            <UInput v-model="defaultNote" type="text" label="Note par défaut" placeholder="Merci pour votre confiance. Paiement à effectuer sous 30 jours." />
            <UFileInput @update:file="handleFileUpload" />
        </div>
    </div>
    <UButton class="w-full mt-6" @click="handleNextStep">Continuer</UButton>
</template>


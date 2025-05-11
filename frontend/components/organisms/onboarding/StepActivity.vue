<script setup lang="ts">
    import BriefcaseIcon from '~/components/atoms/icons/BriefcaseIcon.vue';
    import BuildingIcon from '~/components/atoms/icons/BuildingIcon.vue';
    import FileIcon from '~/components/atoms/icons/FileIcon.vue';
    import HelpCircleIcon from '~/components/atoms/icons/HelpCircleIcon.vue';

    interface StepActivityProps {
        nextStep?: () => void;
    }

    const props = defineProps<StepActivityProps>();
    const onboardingStore = useOnboardingStore();
    const selectedProStatus = ref<string>();
    const siret = ref<string>(onboardingStore.company.siret || '');
    const tradeName = ref<string>(onboardingStore.company.tradeName || '');
    const activityDomain = ref<string>(onboardingStore.company.activity || '');

    const proStatusOptions = [
        {
            label: 'Auto-entrepreneur',
            value: 'autoentrepreneur',
            description: 'Statut simplifié, plafond de CA',
            icon: BuildingIcon,
        },
        {
            label: 'SASU',
            value: 'sasu',
            description: 'Société unipersonnelle à responsabilité',
            icon: BriefcaseIcon,
        },
        {
            label: 'EURL',
            value: 'eurl',
            description: 'Entreprise unipersonnelle à responsabilité',
            icon: FileIcon,
        },
        {
            value: 'en_reflexion',
            label: 'En réflexion',
            description: 'Je suis en train de créer mon activité',
            icon: HelpCircleIcon,
        },
    ];

    function handleNextStep() {
        if (!selectedProStatus.value) return;
        if (!siret.value && selectedProStatus.value !== 'en_reflexion') return;
        if (!tradeName.value) return;
        if (!activityDomain.value) return;

        onboardingStore.company.activity = activityDomain.value;
        onboardingStore.company.tradeName = tradeName.value;
        onboardingStore.company.siret = siret.value ?? '-';
        onboardingStore.company.status = selectedProStatus.value;

        if (props.nextStep) {
            props.nextStep();
        }
    }
</script>

<template>
    <div class="bg-primary p-3.5 rounded-xl border border-primary shadow-xs h-fit w-fit mx-auto relative">
        <BuildingIcon class="text-fg-secondary size-7" />
    </div>
    <h2 class="font-semibold text-primary text-3xl mt-8 text-center relative">Votre activité</h2>
    <p class="text-tertiary text-center mt-3 relative max-w-90 mx-auto">
        Précisez votre statut, votre SIRET et votre domaine
    </p>
    <Transition name="slide-fade">
        <div v-if="!selectedProStatus" class="mt-8 relative max-w-5xl mx-auto w-full">
            <URadioGroup v-model="selectedProStatus" :items="proStatusOptions" />
        </div>
    </Transition>
    <Transition name="slide-fade">
        <div v-show="selectedProStatus" class="mt-8 relative max-w-5xl mx-auto w-full space-y-5">
            <UInput
                v-if="selectedProStatus !== 'en_reflexion'"
                v-model="siret"
                type="text"
                placeholder="SIRET"
                label="Siret"
                hint-text="Le siret doit contenir 14 chiffres."
                class="w-full"
            />
            <UInput
                v-model="activityDomain"
                type="text"
                placeholder="Domaine d'activité (ex: Informatique)"
                label="Domaine d'activité"
                class="w-full"
            />
            <UInput
                v-model="tradeName"
                type="text"
                placeholder="Nom commercial"
                label="Nom commercial"
                class="w-full"
            />
        </div>
    </Transition>
    <UButton v-if="selectedProStatus" class="w-full mt-6" @click="handleNextStep">Continuer</UButton>
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


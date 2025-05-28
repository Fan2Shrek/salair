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
    const { validateSiret } = useFormValidation();
    const { t } = useI18n();
    const selectedProStatus = ref<string>();
    const siret = ref<string>(onboardingStore.company.siret || '');
    const tradeName = ref<string>(onboardingStore.company.tradeName || '');
    const activityDomain = ref<string>(onboardingStore.company.activity || '');

    const proStatusOptions = computed(() => [
        {
            label: t('onboarding.activity.status_options.auto_entrepreneur.label'),
            value: 'autoentrepreneur',
            description: t('onboarding.activity.status_options.auto_entrepreneur.description'),
            icon: BuildingIcon,
        },
        {
            label: t('onboarding.activity.status_options.sasu.label'),
            value: 'sasu',
            description: t('onboarding.activity.status_options.sasu.description'),
            icon: BriefcaseIcon,
        },
        {
            label: t('onboarding.activity.status_options.eurl.label'),
            value: 'eurl',
            description: t('onboarding.activity.status_options.eurl.description'),
            icon: FileIcon,
        },
        {
            value: 'en_reflexion',
            label: t('onboarding.activity.status_options.in_progress.label'),
            description: t('onboarding.activity.status_options.in_progress.description'),
            icon: HelpCircleIcon,
        },
    ]);

    function handleNextStep() {
        if (!selectedProStatus.value) return;
        if (selectedProStatus.value !== 'en_reflexion') {
            if (!siret.value) return;
            if (!validateSiret(siret.value)) {
                return;
            }
        }
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
    <h2 class="font-semibold text-primary text-3xl mt-8 text-center relative">{{ t('onboarding.activity.title') }}</h2>
    <p class="text-tertiary text-center mt-3 relative max-w-90 mx-auto">
        {{ t('onboarding.activity.subtitle') }}
    </p>
    <Transition name="slide-fade">
        <div v-if="!selectedProStatus" class="mt-8 relative max-w-5xl mx-auto w-full">
            <URadioGroup v-model="selectedProStatus" :items="proStatusOptions" />
        </div>
    </Transition>
    <Transition name="slide-fade">
        <form
            v-if="selectedProStatus"
            class="mt-8 relative max-w-5xl mx-auto w-full space-y-5"
            @submit.prevent="handleNextStep"
        >
            <UInput
                v-if="selectedProStatus !== 'en_reflexion'"
                v-model="siret"
                type="text"
                :placeholder="t('onboarding.activity.form.siret.placeholder')"
                :label="t('onboarding.activity.form.siret.label')"
                :hint-text="t('onboarding.activity.form.siret.hint')"
                class="w-full"
            />
            <UInput
                v-model="activityDomain"
                type="text"
                :placeholder="t('onboarding.activity.form.activity.placeholder')"
                :label="t('onboarding.activity.form.activity.label')"
                class="w-full"
            />
            <UInput
                v-model="tradeName"
                type="text"
                :placeholder="t('onboarding.activity.form.trade_name.placeholder')"
                :label="t('onboarding.activity.form.trade_name.label')"
                class="w-full"
            />
            <UButton v-if="selectedProStatus" class="w-full mt-6" type="submit">{{ t('general.continue') }}</UButton>
        </form>
    </Transition>
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


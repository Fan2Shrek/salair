<script setup lang="ts">
    import { StepUserDetails, StepActivity, StepBilling, StepPassword, StepUrssaf } from '#components';
    import BuildingIcon from '~/components/atoms/icons/BuildingIcon.vue';
    import CalendarIcon from '~/components/atoms/icons/CalendarIcon.vue';
    import PasscodeIcon from '~/components/atoms/icons/PasscodeIcon.vue';
    import ReceiptCheckIcon from '~/components/atoms/icons/ReceiptCheckIcon.vue';
    import UserIcon from '~/components/atoms/icons/UserIcon.vue';

    const steps = [
        {
            title: 'Vos informations',
            description: 'Entrez votre nom complet et votre adresse email',
            icon: UserIcon,
        },
        {
            title: 'Mot de passe',
            description: 'Choisissez un mot de passe sécurisé pour votre compte',
            icon: PasscodeIcon,
        },
        {
            title: 'Votre activité',
            description: 'Précisez votre statut, votre SIRET et votre domaine',
            icon: BuildingIcon,
        },
        {
            title: 'Déclarations URSSAF',
            description: 'Indiquez la fréquence de vos déclarations',
            icon: CalendarIcon,
        },
        {
            title: 'Préférences de facturation',
            description: 'Configurez vos premières préférences de facturation',
            icon: ReceiptCheckIcon,
        },
    ];
    const activeTab = ref<number>(0);
    const previousTab = ref<number>(0);
    const onboardingStore = useOnboardingStore();
    const authStore = useAuthStore()

    const direction = computed(() => {
        return activeTab.value > previousTab.value ? 'left' : 'right';
    });

    function nextStep() {
        if (activeTab.value < steps.length - 1) {
            previousTab.value = activeTab.value;
            activeTab.value++;
        }
    }

    function _prevStep() {
        if (activeTab.value > 0) {
            previousTab.value = activeTab.value;
            activeTab.value--;
        }
    }

    function handleLogoClick() {
        onboardingStore.reset();
        navigateTo('/')
    }

    onMounted(() => {
        if (!useOnboardingStore().email) {
            navigateTo('/signup');
        }

        if (authStore.user && !authStore.user.company) {
            activeTab.value = 2
        }
    });
</script>

<template>
    <main class="h-full w-full flex">
        <section class="max-w-md w-full bg-secondary flex flex-col">
            <div class="pt-8 px-8 flex-grow">
                <div
                    class="flex items-center gap-3 rounded-lg hover:bg-secondary-hover p-2 cursor-pointer w-fit"
                    @click="handleLogoClick"
                >
                    <ULogo class="size-8" alt="Logo Salair" />
                    <p class="text-primary font-semibold text-lg">Salair</p>
                </div>
                <div class="mt-20 w-full">
                    <UStepper :items="steps" :active-tab="activeTab" />
                </div>
            </div>
            <div class="p-8 flex justify-between items-end">
                <p class="hidden md:block text-tertiary text-sm">© Salair {{ new Date().getFullYear() }}</p>
                <div class="hidden md:flex items-center gap-2">
                    <MailIcon class="text-fg-quaternary size-4" />
                    <ULink to="mailto:help@salair.fr" class="text-tertiary text-sm">help@salair.fr</ULink>
                </div>
            </div>
        </section>
        <section class="flex-grow h-full pt-40 pb-24 flex flex-col items-center relative">
            <UGridBackgroundPattern class="absolute top-0" />

            <Transition :name="`slide-${direction}`" mode="out-in">
                <div :key="activeTab">
                    <StepUserDetails v-if="activeTab === 0" :next-step="nextStep" />
                    <StepPassword v-else-if="activeTab === 1" :next-step="nextStep" />
                    <StepActivity v-else-if="activeTab === 2" :next-step="nextStep" />
                    <StepUrssaf v-else-if="activeTab === 3" :next-step="nextStep" />
                    <StepBilling v-else-if="activeTab === 4" />
                </div>
            </Transition>
        </section>
    </main>
</template>

<style scoped>
    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-right-enter-active,
    .slide-right-leave-active {
        transition: all 0.2s;
    }
    .slide-left-enter-from {
        opacity: 0;
        transform: translate(50px, 0);
    }
    .slide-left-leave-to {
        opacity: 0;
        transform: translate(-50px, 0);
    }
    .slide-right-enter-from {
        opacity: 0;
        transform: translate(-50px, 0);
    }
    .slide-right-leave-to {
        opacity: 0;
        transform: translate(50px, 0);
    }
</style>


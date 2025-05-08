<script setup lang="ts">
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
    const activeTab = ref<number>(1)
</script>

<template>
    <main class="h-full w-full flex">
        <section class="max-w-md w-full bg-secondary flex flex-col">
            <div class="pt-8 px-8 flex-grow">
                <div
                    class="flex items-center gap-3 rounded-lg hover:bg-primary-hover p-2 cursor-pointer"
                    @click="navigateTo('/')"
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
    </main>
</template>


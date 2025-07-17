<script setup lang="ts">
    import { ref } from 'vue';
    import URadioGroup from '@/components/atoms/URadioGroup.vue';
    import UserIcon from '~/components/atoms/icons/UserIcon.vue';
    import BuildingIcon from '~/components/atoms/icons/BuildingIcon.vue';
    import HeartIcon from '~/components/atoms/icons/HeartIcon.vue';

    const selectedPlan = ref('basic');

    const planOptions = [
        {
            label: 'Basic',
            value: 'basic',
            description: 'Parfait pour les petites entreprises',
            icon: BuildingIcon,
        },
        {
            label: 'Pro',
            value: 'pro',
            description: 'Pour les équipes en croissance',
            icon: UserIcon,
        },
        {
            label: 'Enterprise',
            value: 'enterprise',
            description: 'Solutions personnalisées pour les grandes entreprises',
            icon: HeartIcon,
        },
    ];
</script>

<template>
    <NuxtLayout name="doc">
        <div class="container mx-auto p-4">
            <h2 class="text-xl font-bold mb-4">Sélectionnez un plan :</h2>

            <URadioGroup v-model="selectedPlan" :items="planOptions" orientation="vertical" />

            <URadioGroup v-model="selectedPlan" :items="planOptions" orientation="horizontal" class="mt-6" />

            <div class="mt-4">Plan sélectionné : {{ selectedPlan }}</div>
        </div>
    </NuxtLayout>
</template>

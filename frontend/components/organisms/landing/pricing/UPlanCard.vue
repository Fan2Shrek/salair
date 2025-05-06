<script setup lang="ts">
    interface PlanCardProps {
        name: string;
        price: number;
        billingCycle: 'monthly' | 'yearly';
        description: string;
        popular?: boolean;
        features: string[];
        highlightedText?: string;
    }

    const _props = withDefaults(defineProps<PlanCardProps>(), {
        popular: false,
        highlightedText: ''
    });
</script>

<template>
    <div class="shadow-lg bg-primary border border-secondary rounded-2xl w-full">
        <div class="w-full p-8 border-b border-secondary">
            <div class="flex items-center justify-between">
                <h4 class="font-semibold text-tertiary text-lg">{{ name }}</h4>
                <UBadge v-if="popular" color="brand" variant="pill">{{ highlightedText || 'Popular' }}</UBadge>
            </div>
            <div class="flex items-end mt-4 gap-1">
                <p class="text-6xl font-semibold text-primary">${{ price }}</p>
                <p class="text-tertiary font-medium mb-2">{{ billingCycle === 'monthly' ? 'per month' : 'per year' }}</p>
            </div>
            <p class="text-tertiary mt-4">{{ description }}</p>
            <div class="mt-8 space-y-3">
                <UButton class="w-full">Get started</UButton>
                <UButton variant="secondary" class="w-full">Chat with us</UButton>
            </div>
        </div>
        <div class="pt-8 px-8 pb-10 w-full">
            <div class="space-y-1">
                <p class="text-primary font-semibold uppercase">FEATURES</p>
                <p class="text-tertiary">Everything in our <span class="font-semibold">free plan</span> plus....</p>
            </div>
            <div class="space-y-4 w-full mt-6">
                <div v-for="(feature, index) in features" :key="index" class="flex gap-3 w-full">
                    <CheckCircleIcon class="text-fg-brand-primary size-6 min-w-6" />
                    <p class="text-tertiary">{{ feature }}</p>
                </div>
            </div>
        </div>
    </div>
</template>


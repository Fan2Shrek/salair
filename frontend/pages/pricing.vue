<script setup lang="ts">
    import type Plan from '~/types/plan';

    useSeoMeta({
        title: 'Pricing',
    });

    const tabItems = [
        { name: 'monthly', label: 'Monthly billing' },
        { name: 'yearly', label: 'Annual billing' },
    ];

    const monthlyPlans = ref<Plan[]>([]);
    const _annualPlans = ref();
    const _freePlan = ref();
    const { $api } = useNuxtApp();

    onMounted(async () => {
        const { data, error } = await useAuthFetch<Plan[]>($api('/api/plans'));

        if (data.value && !error.value) {
            monthlyPlans.value = data.value;
        }
    });
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full h-full relative" role="main">
            <section class="pt-19 max-w-7xl mx-auto w-full">
                <div class="mt-24">
                    <p class="text-brand-secondary font-semibold text-center">Pricing</p>
                    <h1 class="text-primary text-5xl font-semibold text-center mt-3">Simple, transparent pricing</h1>
                    <p class="text-tertiary text-xl text-center mt-6">
                        We believe Salair should be accessible to all companies, no matter the size.
                    </p>
                </div>
                <div class="w-full flex flex-col items-center mt-12">
                    <UTabs variant="border" :items="tabItems">
                        <template v-if="monthlyPlans" #monthly>
                            <div class="py-24 w-full flex gap-8">
                                <UPlanCard
                                    v-for="plan in monthlyPlans"
                                    :key="plan.id"
                                    :name="plan.name"
                                    :description="plan.description"
                                    :popular="plan.isPopular"
                                    :billing-cycle="plan.billingCycle"
                                    :features="plan.features"
                                    :price="plan.priceCents / 100"
                                />
                            </div>
                        </template>
                        <template #yearly>
                            <div class="py-24 w-full flex gap-8">
                                <div class="shadow-lg bg-primary border border-secondary rounded-2xl w-full">
                                    <div class="w-full p-8 border-b border-secondary">
                                        <div class="flex items-center justify-between">
                                            <h4 class="font-semibold text-tertiary text-lg">Basic plan</h4>
                                            <UBadge color="brand" variant="pill">Popular</UBadge>
                                        </div>
                                        <div class="flex items-end mt-4 gap-1">
                                            <p class="text-6xl font-semibold text-primary">$10</p>
                                            <p class="text-tertiary font-medium mb-2">per month</p>
                                        </div>
                                        <p class="text-tertiary mt-4">Our most popular plan.</p>
                                        <div class="mt-8 space-y-3">
                                            <UButton class="w-full">Get started</UButton>
                                            <UButton variant="secondary" class="w-full">Chat with us</UButton>
                                        </div>
                                    </div>
                                    <div class="pt-8 px-8 pb-10 w-full">
                                        <div class="space-y-1">
                                            <p class="text-primary font-semibold uppercase">FEATURES</p>
                                            <p class="text-tertiary">
                                                Everything in our <span class="font-semibold">free plan</span> plus....
                                            </p>
                                        </div>
                                        <div class="space-y-4 w-full mt-6">
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="shadow-lg bg-primary border border-secondary rounded-2xl w-full">
                                    <div class="w-full p-8 border-b border-secondary">
                                        <div class="flex items-center justify-between">
                                            <h4 class="font-semibold text-tertiary text-lg">Basic plan</h4>
                                            <UBadge color="brand" variant="pill">Popular</UBadge>
                                        </div>
                                        <div class="flex items-end mt-4 gap-1">
                                            <p class="text-6xl font-semibold text-primary">$10</p>
                                            <p class="text-tertiary font-medium mb-2">per month</p>
                                        </div>
                                        <p class="text-tertiary mt-4">Our most popular plan.</p>
                                        <div class="mt-8 space-y-3">
                                            <UButton class="w-full">Get started</UButton>
                                            <UButton variant="secondary" class="w-full">Chat with us</UButton>
                                        </div>
                                    </div>
                                    <div class="pt-8 px-8 pb-10 w-full">
                                        <div class="space-y-1">
                                            <p class="text-primary font-semibold uppercase">FEATURES</p>
                                            <p class="text-tertiary">
                                                Everything in our <span class="font-semibold">free plan</span> plus....
                                            </p>
                                        </div>
                                        <div class="space-y-4 w-full mt-6">
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="shadow-lg bg-primary border border-secondary rounded-2xl w-full">
                                    <div class="w-full p-8 border-b border-secondary">
                                        <div class="flex items-center justify-between">
                                            <h4 class="font-semibold text-tertiary text-lg">Basic plan</h4>
                                            <UBadge color="brand" variant="pill">Popular</UBadge>
                                        </div>
                                        <div class="flex items-end mt-4 gap-1">
                                            <p class="text-6xl font-semibold text-primary">$10</p>
                                            <p class="text-tertiary font-medium mb-2">per month</p>
                                        </div>
                                        <p class="text-tertiary mt-4">Our most popular plan.</p>
                                        <div class="mt-8 space-y-3">
                                            <UButton class="w-full">Get started</UButton>
                                            <UButton variant="secondary" class="w-full">Chat with us</UButton>
                                        </div>
                                    </div>
                                    <div class="pt-8 px-8 pb-10 w-full">
                                        <div class="space-y-1">
                                            <p class="text-primary font-semibold uppercase">FEATURES</p>
                                            <p class="text-tertiary">
                                                Everything in our <span class="font-semibold">free plan</span> plus....
                                            </p>
                                        </div>
                                        <div class="space-y-4 w-full mt-6">
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                            <div class="flex items-center gap-3 w-full">
                                                <CheckCircleIcon class="text-fg-brand-primary size-6" />
                                                <p class="text-tertiary">Access to basic features</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </UTabs>
                </div>
            </section>
        </main>
    </NuxtLayout>
</template>


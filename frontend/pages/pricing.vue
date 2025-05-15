<script setup lang="ts">
    import type Plan from '~/types/plan';

    const { t } = useI18n();

    useSeoMeta({
        title: t('pricing.meta_title'),
    });

    const tabItems = [
        { name: 'monthly', label: t('pricing.billing.monthly') },
        { name: 'yearly', label: t('pricing.billing.yearly') },
    ];

    const monthlyPlans = ref<Plan[]>([]);
    const annualPlans = ref<Plan[]>([]);
    const _freePlan = ref();
    const { $api } = useNuxtApp();

    onMounted(async () => {
        const { data, error } = await useAuthFetch<Plan[]>($api('/api/plans'));

        if (data.value && !error.value) {
            // Filter plans by billing cycle
            monthlyPlans.value = data.value.filter((plan) => plan.billingCycle === 'monthly');
            annualPlans.value = data.value.filter((plan) => plan.billingCycle === 'yearly');

            // Add the starter plan to annual plans
            annualPlans.value.unshift(data.value.filter((plan) => plan.priceCents === 0)[0]);
        }
    });
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full flex-grow relative" role="main">
            <section class="pt-19 max-w-7xl mx-auto w-full">
                <div class="mt-24">
                    <p class="text-brand-secondary font-semibold text-center">{{ $t('pricing.meta_title') }}</p>
                    <h1 class="text-primary text-5xl font-semibold text-center mt-3">{{ $t('pricing.title') }}</h1>
                    <p class="text-tertiary text-xl text-center mt-6">
                        {{ $t('pricing.subtitle') }}
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
                        <template v-if="annualPlans" #yearly>
                            <div class="py-24 w-full flex gap-8">
                                <UPlanCard
                                    v-for="plan in annualPlans"
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
                    </UTabs>
                </div>
            </section>
        </main>
    </NuxtLayout>
</template>


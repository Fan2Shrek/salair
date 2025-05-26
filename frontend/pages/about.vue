<script setup lang="ts">
    import ChartIcon from '~/components/atoms/icons/ChartIcon.vue';
    import ClipboardCheckIcon from '~/components/atoms/icons/ClipboardCheckIcon.vue';
    import ReceiptCheckIcon from '~/components/atoms/icons/ReceiptCheckIcon.vue';
    
    const { t } = useI18n();
    
    useSeoMeta({
        title: () => `${t('about.title_small')}`,
    });
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full flex-grow">
            <section class="py-16 md:py-19 w-full bg-secondary">
                <div class="mt-16 md:my-24 max-w-7xl mx-auto w-full max-md:px-4">
                    <p class="text-brand-secondary font-semibold text-center">{{ $t('about.title_small') }}</p>
                    <h1 class="text-primary text-4xl md:text-5xl font-semibold text-center mt-3">
                        {{ $t('about.title') }}
                    </h1>
                    <p class="text-tertiary text-lg md:text-xl text-center mt-6">
                        {{ $t('about.subtitle') }}
                    </p>
                    <div class="mt-8 md:mt-12 md:w-fit mx-auto md:flex items-center gap-3 max-md:space-y-3">
                        <UButton variant="secondary" class="max-md:w-full">{{ $t('about.discover_platform') }}</UButton>
                        <UButton class="max-md:w-full">{{ $t('about.get_started') }}</UButton>
                    </div>
                </div>
            </section>
            <section class="py-16 md:py-24 space-y-12 md:space-y-24">
                <div class="max-w-3xl w-full mx-auto space-y-5 max-md:px-4">
                    <h2 class="text-center text-primary font-semibold text-3xl md:text-4xl">
                        {{ $t('about.mission.title') }}
                    </h2>
                    <p class="text-tertiary text-lg md:text-xl text-center">
                        {{ $t('about.mission.description') }}
                    </p>
                </div>
                <div class="md:flex w-full md:max-h-140 h-full max-md:space-y-10">
                    <div class="md:w-1/2 flex justify-end items-center md:py-24 md:pr-16 px-4">
                        <div class="md:px-8 flex flex-col gap-8">
                            <div class="space-y-5">
                                <UFeaturedIcon :icon="ReceiptCheckIcon" color="brand" size="lg" />
                                <div class="space-y-4">
                                    <h3 class="text-primary font-semibold text-2xl md:text-3xl">
                                        {{ $t('about.invoicing.title') }}
                                    </h3>
                                    <p class="md:text-lg text-tertiary self-stretch">
                                        {{ $t('about.invoicing.description') }}
                                    </p>
                                </div>
                            </div>
                            <div class="pl-4 space-y-5">
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">
                                        {{ $t('about.invoicing.feature1') }}
                                    </p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">{{ $t('about.invoicing.feature2') }}</p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">{{ $t('about.invoicing.feature3') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img
                        class="md:w-1/2 max-md:px-4 max-h-60 md:max-h-140 h-full object-cover"
                        src="https://storage.salair.fr/salair/public/about_1.jpg"
                    />
                </div>
                <div class="md:flex flex-row-reverse w-full md:max-h-140 h-full max-md:space-y-10">
                    <div class="md:w-1/2 flex justify-end items-center md:py-24 md:pr-16 px-4">
                        <div class="md:px-8 flex flex-col gap-8">
                            <div class="space-y-5">
                                <UFeaturedIcon :icon="ClipboardCheckIcon" color="brand" size="lg" />
                                <div class="space-y-4">
                                    <h3 class="text-primary font-semibold text-2xl md:text-3xl">{{ $t('about.tax.title') }}</h3>
                                    <p class="md:text-lg text-tertiary self-stretch">
                                        {{ $t('about.tax.description') }}
                                    </p>
                                </div>
                            </div>
                            <div class="pl-4 space-y-5">
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">{{ $t('about.tax.feature1') }}</p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">{{ $t('about.tax.feature2') }}</p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">{{ $t('about.tax.feature3') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img
                        class="md:w-1/2 max-md:px-4 max-h-60 md:max-h-140 h-full object-cover"
                        src="https://storage.salair.fr/salair/public/about_2.jpg"
                    />
                </div>
                <div class="md:flex w-full md:max-h-140 h-full max-md:space-y-10">
                    <div class="md:w-1/2 flex justify-end items-center md:py-24 md:pr-16 px-4">
                        <div class="md:px-8 flex flex-col gap-8">
                            <div class="space-y-5">
                                <UFeaturedIcon :icon="ChartIcon" color="brand" size="lg" />
                                <div class="space-y-4">
                                    <h3 class="text-primary font-semibold text-2xl md:text-3xl">
                                        {{ $t('about.activity.title') }}
                                    </h3>
                                    <p class="md:text-lg text-tertiary self-stretch">
                                        {{ $t('about.activity.description') }}
                                    </p>
                                </div>
                            </div>
                            <div class="pl-4 space-y-5">
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">
                                        {{ $t('about.activity.feature1') }}
                                    </p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">{{ $t('about.activity.feature2') }}</p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">{{ $t('about.activity.feature3') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img
                        class="md:w-1/2 max-md:px-4 max-h-60 md:max-h-140 h-full object-cover"
                        src="https://storage.salair.fr/salair/public/about_3.jpg"
                    />
                </div>
            </section>
        </main>
    </NuxtLayout>
</template>


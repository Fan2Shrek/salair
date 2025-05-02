<script setup lang="ts">
    import PlayCircleIcon from '~/components/atoms/icons/PlayCircleIcon.vue';
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full h-full relative">
            <div class="absolute top-0 flex justify-center w-full">
                <UChessBackgroundPattern class="mx-auto" />
            </div>
            <section class="pt-10 md:pt-19 px-4 sm:px-6 max-w-7xl w-full mx-auto pb-24">
                <div class="mt-12 md:mt-24 relative">
                    <UBadge variant="modern" class="w-fit mx-auto">New features</UBadge>
                    <h1
                        class="text-primary font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center mt-4 md:mt-6"
                    >
                        {{ $t('landing.title') }}
                    </h1>
                    <p
                        class="mt-4 md:mt-6 mx-auto max-w-3xl w-full text-center text-tertiary text-base sm:text-lg md:text-xl"
                    >
                        {{ $t('landing.subtitle') }}
                    </p>
                </div>
                <div class="mt-8 md:mt-12 w-fit mx-auto flex flex-col sm:flex-row items-center gap-3 relative">
                    <UButton
                        variant="secondary"
                        size="xl"
                        :icon="PlayCircleIcon"
                        icon-position="leading"
                        class="w-full sm:w-auto"
                        >Demo</UButton
                    >
                    <UButton size="xl" class="w-full sm:w-auto mt-3 sm:mt-0">{{ $t('general.sign_up') }} </UButton>
                </div>
                <div
                    class="mt-10 sm:mt-14 md:mt-18 relative max-h-[300px] sm:max-h-[400px] md:max-h-[500px] overflow-hidden"
                >
                    <div
                        class="max-w-7xl w-full bg-primary border border-secondary h-[808px] rounded-[32px] shadow-lg p-1"
                    >
                        <div class="w-full h-full rounded-[28px] bg-primary shadow-inner p-1">
                            <div class="w-full h-full border border-utility-gray-200 bg-utility-gray-50 rounded-3xl" />
                        </div>
                    </div>
                </div>
            </section>
            <section class="max-w-7xl mx-auto w-full bg-primary py-24 border-t border-secondary">
                <div class="max-w-3xl w-full mx-auto">
                    <p class="text-brand-secondary font-semibold text-center">{{ $t('features.title') }}</p>
                    <h2 class="text-3xl font-semibold text-primary text-center mt-3">
                        {{ $t('features.heading') }}
                    </h2>
                    <p class="mt-5 text-tertiary text-center text-xl">
                        {{ $t('features.description') }}
                    </p>
                </div>
                <div class="grid grid-cols-3 gap-x-8 gap-y-16 mt-16">
                    <div class="flex flex-col gap-4">
                        <div class="bg-primary border border-primary p-3 rounded-[10px] w-fit mx-auto shadow-xs">
                            <RepeatIcon class="size-6" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-primary text-lg font-semibold text-center">{{ $t('features.items.access.title') }}</h3>
                            <p class="text-tertiary text-center">
                                {{ $t('features.items.access.description') }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="bg-primary border border-primary p-3 rounded-[10px] w-fit mx-auto shadow-xs">
                            <LightningIcon class="size-6" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-primary text-lg font-semibold text-center">
                                {{ $t('features.items.payslips.title') }}
                            </h3>
                            <p class="text-tertiary text-center">
                                {{ $t('features.items.payslips.description') }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="bg-primary border border-primary p-3 rounded-[10px] w-fit mx-auto shadow-xs">
                            <ChartIcon class="size-6" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-primary text-lg font-semibold text-center">
                                {{ $t('features.items.reports.title') }}
                            </h3>
                            <p class="text-tertiary text-center">
                                {{ $t('features.items.reports.description') }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="bg-primary border border-primary p-3 rounded-[10px] w-fit mx-auto shadow-xs">
                            <MessageIcon class="size-6" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-primary text-lg font-semibold text-center">
                                {{ $t('features.items.employees.title') }}
                            </h3>
                            <p class="text-tertiary text-center">
                                {{ $t('features.items.employees.description') }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="bg-primary border border-primary p-3 rounded-[10px] w-fit mx-auto shadow-xs">
                            <FolderIcon class="size-6" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-primary text-lg font-semibold text-center">{{ $t('features.items.documents.title') }}</h3>
                            <p class="text-tertiary text-center">
                                {{ $t('features.items.documents.description') }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="bg-primary border border-primary p-3 rounded-[10px] w-fit mx-auto shadow-xs">
                            <PhoneIcon class="size-6" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-primary text-lg font-semibold text-center">
                                {{ $t('features.items.support.title') }}
                            </h3>
                            <p class="text-tertiary text-center">
                                {{ $t('features.items.support.description') }}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </NuxtLayout>
</template>


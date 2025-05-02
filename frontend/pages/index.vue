<script setup lang="ts">
    import PlayCircleIcon from '~/components/atoms/icons/PlayCircleIcon.vue';
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full h-full relative">
            <div class="absolute top-0 flex justify-center w-full">
                <UChessBackgroundPattern class="mx-auto" />
            </div>
            <section class="pt-10 md:pt-19 px-4 sm:px-6 max-w-7xl w-full mx-auto">
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
                    class="mt-10 sm:mt-14 md:mt-18 relative max-h-[300px] sm:max-h-[400px] md:max-h-[496px] overflow-hidden"
                >
                    <NuxtImg class="w-full" src="/landing-mockup.png" />
                </div>
            </section>
        </main>
    </NuxtLayout>
</template>


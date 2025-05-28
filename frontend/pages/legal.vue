<script setup lang="ts">
    const { locale, t } = useI18n();
    const data = ref();

    const loadData = async () => {
        const result = await useAsyncData(`legal-${locale.value}`, () =>
            queryCollection('content').path(`/legal.${locale.value}`).first()
        );
        data.value = result.data.value;
    };

    watch(locale, loadData, { immediate: true });
    
    useSeoMeta({
        title: computed(() => t('legal_page.title')),
        description: computed(() => t('legal_page.intro'))
    });
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full flex-grow">
            <section class="pt-19 max-w-7xl mx-auto w-full">
                <div class="my-12 md:my-24 max-w-3xl w-full mx-auto px-4 md:px-0">
                    <p class="text-brand-secondary font-semibold text-center">{{ $t('legal_page.last_updated') }}</p>
                    <h1 class="text-primary text-3xl md:text-5xl font-semibold text-center mt-3">{{ $t('legal_page.title') }}</h1>
                    <p class="text-tertiary text-lg md:text-xl text-center mt-6">
                        {{ $t('legal_page.intro') }}
                    </p>
                </div>
                <div class="max-w-prose w-full mx-auto content pb-12 md:pb-24 px-4 md:px-0">
                    <ContentRenderer v-if="data" :value="data" class="content" />
                </div>
            </section>
        </main>
    </NuxtLayout>
</template>


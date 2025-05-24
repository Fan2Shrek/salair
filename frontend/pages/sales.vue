<script setup lang="ts">
    const { locale, t } = useI18n();
    const data = ref();

    const loadData = async () => {
        const result = await useAsyncData(`terms-sales-${locale.value}`, () =>
            queryCollection('content').path(`/terms-sales.${locale.value}`).first()
        );
        data.value = result.data.value;
    };

    watch(locale, loadData, { immediate: true });
    
    useSeoMeta({
        title: computed(() => t('sales_page.title')),
        description: computed(() => t('sales_page.intro'))
    });
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full flex-grow">
            <section class="pt-19 max-w-7xl mx-auto w-full">
                <div class="my-12 md:my-24 max-w-3xl w-full mx-auto px-4 md:px-0">
                    <p class="text-brand-secondary font-semibold text-center">{{ $t('sales_page.last_updated') }}</p>
                    <h1 class="text-primary text-3xl md:text-5xl font-semibold text-center mt-3">
                        {{ $t('sales_page.title') }}
                    </h1>
                    <p class="text-tertiary text-lg md:text-xl text-center mt-6">
                        {{ $t('sales_page.intro') }}
                    </p>
                </div>
                <div class="max-w-prose w-full mx-auto content pb-12 md:pb-24 px-4 md:px-0">
                    <ContentRenderer v-if="data" :value="data" class="content" />
                </div>
            </section>
        </main>
    </NuxtLayout>
</template>

<style>
    .content {
        @apply prose;

        p {
            @apply text-tertiary;
            @apply text-base md:text-lg;
        }

        h1 {
            @apply text-primary;
            @apply font-semibold;
            @apply text-2xl md:text-3xl;
            @apply mb-4;

            a {
                @apply no-underline;
            }
        }

        h2 {
            @apply text-primary;
            @apply font-semibold;
            @apply text-xl md:text-2xl;
            @apply pt-6 md:pt-8;
            @apply pb-3 md:pb-4;

            a {
                @apply no-underline;
            }
        }

        ol {
            @apply pl-5;
            
            li {
                @apply list-decimal;
                @apply list-outside;
                @apply text-tertiary;
                @apply text-base md:text-lg;
            }
        }

        ul {
            @apply pl-5;
            
            li {
                @apply list-disc;
                @apply list-outside;
                @apply text-tertiary;
                @apply text-base md:text-lg;
            }
        }

        strong {
            @apply font-semibold;
            @apply text-secondary;
        }

        a {
            @apply text-secondary;
            @apply hover:text-secondary-hover;
        }
    }
</style>


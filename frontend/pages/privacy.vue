<script setup lang="ts">
    const { locale } = useI18n();
    const data = ref();

    const loadData = async () => {
        const result = await useAsyncData(`privacy-${locale.value}`, () =>
            queryCollection('content').path(`/privacy.${locale.value}`).first()
        );
        data.value = result.data.value;
    };

    watch(locale, loadData, { immediate: true });
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full flex-grow">
            <section class="pt-19 max-w-7xl mx-auto w-full">
                <div class="my-24 max-w-3xl w-full mx-auto">
                    <p class="text-brand-secondary font-semibold text-center">{{ $t('privacy_page.last_updated') }}</p>
                    <h1 class="text-primary text-5xl font-semibold text-center mt-3">{{ $t('privacy_page.title') }}</h1>
                    <p class="text-tertiary text-xl text-center mt-6">
                        {{ $t('privacy_page.intro') }}
                    </p>
                </div>
                <div class="max-w-prose w-full mx-auto content pb-24">
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
            @apply text-lg;
        }

        h2 {
            @apply text-primary;
            @apply font-semibold;
            @apply text-3xl;

            a {
                @apply no-underline;
            }
        }

        h3 {
            @apply text-primary;
            @apply font-semibold;
            @apply text-2xl;
            @apply pt-8;
            @apply pb-4;
        }

        ol {
            li {
                @apply list-decimal;
                @apply list-outside;
                @apply text-tertiary;
                @apply text-lg;
            }
        }

        ul {
            li {
                @apply list-decimal;
                @apply list-disc;
                @apply text-tertiary;
                @apply text-lg;
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


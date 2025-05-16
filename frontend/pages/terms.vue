<script setup lang="ts">
    const { locale } = useI18n();
    const data = ref();

    const loadData = async () => {
        const result = await useAsyncData(`terms-${locale.value}`, () =>
            queryCollection('content').path(`/terms.${locale.value}`).first()
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
                    <p class="text-brand-secondary font-semibold text-center">Dernière mise à jour : 16 mai 2025</p>
                    <h1 class="text-primary text-5xl font-semibold text-center mt-3">
                        Terms and conditions
                    </h1>
                    <p class="text-tertiary text-xl text-center mt-6">
                        By accessing our website, you are agreeing to be bound by these terms of service, all applicable
                        laws and regulations, and agree that you are responsible for compliance with any applicable
                        local laws.
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


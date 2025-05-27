<script lang="ts" setup>
    const route = useRoute();
    const slug = route.params.slug as string;
    const { d } = useI18n();

    const { fetchArticleMetadata, content, loadContent, metadata } = useBlogArticle(slug);

    onMounted(async () => {
        await fetchArticleMetadata();
        await loadContent();

        useSeoMeta({
            title: content.value?.title,
        });

        console.log(content.value);
    });
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full flex-grow">
            <section class="pt-19 w-full">
                <div v-if="content" class="my-12 md:my-24 max-w-3xl w-full mx-auto px-4 md:px-0 max-w-7xl mx-auto w-full">
                    <p class="text-brand-secondary font-semibold text-center">
                        Last update:
                        {{ d(new Date(metadata?.updatedAt!), { year: 'numeric', month: 'long', day: 'numeric' }) }}
                    </p>
                    <h1 class="text-primary text-3xl md:text-5xl font-semibold text-center mt-3">
                        {{ content?.title }}
                    </h1>
                    <p class="text-tertiary text-lg md:text-xl text-center mt-6">
                        {{ content?.description }}
                    </p>
                </div>
                <img v-if="metadata?.mainPicture" :src="metadata.mainPicture" class="max-h-160 mx-auto object-cover max-w-7xl w-full">
                <div class="max-w-prose w-full mx-auto pb-12 md:pb-24 px-4 md:px-0 mt-24">
                    <ContentRenderer v-if="content" :value="content" class="content pb-12" />
                    <div v-if="metadata" class="pt-6 border-t border-secondary flex justify-between w-full">
                        <div class="flex gap-3 items-center">
                            <UAvatar v-if="metadata.author.avatar" size="lg" :image-src="metadata.author.avatar" />
                            <UAvatar
                                v-else
                                size="lg"
                                :text="metadata.author.firstName[0] + metadata.author.lastName[0]"
                            />
                            <div class="flex-grow">
                                <p class="font-semibold text-primary">
                                    {{ metadata.author.firstName }} {{ metadata.author.lastName }}
                                </p>
                                <p class="text-tertiary text-sm">{{ metadata.author.email }}</p>
                            </div>
                        </div>
                    </div>
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


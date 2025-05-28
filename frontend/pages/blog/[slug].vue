<script lang="ts" setup>
    import USkeleton from '~/components/atoms/USkeleton.vue';

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
    });
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full flex-grow">
            <section v-if="content" class="pt-16 sm:pt-19 w-full">
                <!-- Header section -->
                <div class="my-8 sm:my-12 lg:my-24 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <p class="text-brand-secondary font-semibold text-center text-sm sm:text-base">
                        Last update:
                        {{ d(new Date(metadata?.updatedAt!), { year: 'numeric', month: 'long', day: 'numeric' }) }}
                    </p>
                    <h1 class="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-center mt-3 leading-tight">
                        {{ content?.title }}
                    </h1>
                    <p class="text-tertiary text-base sm:text-lg md:text-xl lg:text-2xl text-center mt-4 sm:mt-6 max-w-3xl mx-auto leading-relaxed">
                        {{ content?.description }}
                    </p>
                </div>
                
                <!-- Main image -->
                <div v-if="metadata?.mainPicture" class="w-full px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 lg:mb-16">
                    <img
                        :src="metadata.mainPicture"
                        :alt="content?.title"
                        class="max-h-96 sm:max-h-120 lg:max-h-160 mx-auto object-cover max-w-full w-full rounded-lg shadow-lg"
                    />
                </div>
                
                <!-- Content section -->
                <div class="max-w-none sm:max-w-prose lg:max-w-4xl w-full mx-auto pb-8 sm:pb-12 lg:pb-24 px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-24">
                    <ContentRenderer v-if="content" :value="content" class="content pb-8 sm:pb-12" />
                    
                    <!-- Author section -->
                    <div v-if="metadata" class="pt-6 sm:pt-8 border-t border-secondary">
                        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                            <div class="flex gap-3 items-center w-full sm:w-auto">
                                <UAvatar 
                                    v-if="metadata.author.avatar" 
                                    size="lg" 
                                    :image-src="metadata.author.avatar" 
                                    class="flex-shrink-0"
                                />
                                <UAvatar
                                    v-else
                                    size="lg"
                                    :text="metadata.author.firstName[0] + metadata.author.lastName[0]"
                                    class="flex-shrink-0"
                                />
                                <div class="flex-grow min-w-0">
                                    <p class="font-semibold text-primary text-sm sm:text-base truncate">
                                        {{ metadata.author.firstName }} {{ metadata.author.lastName }}
                                    </p>
                                    <p class="text-tertiary text-xs sm:text-sm truncate">{{ metadata.author.email }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section v-else class="pt-16 sm:pt-19 w-full">
                <!-- Loading skeletons -->
                <USkeleton class="my-8 sm:my-12 lg:my-24 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-48 sm:h-60 lg:h-72"></USkeleton>
                <div class="w-full px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 lg:mb-16">
                    <USkeleton class="max-w-full mx-auto w-full h-48 sm:h-96 lg:h-160 rounded-lg" />
                </div>
                <USkeleton class="max-w-none sm:max-w-prose lg:max-w-4xl w-full mx-auto h-96 sm:h-120 lg:h-160 mt-8 sm:mt-12 lg:mt-24 px-4 sm:px-6 lg:px-8" />
            </section>
        </main>
    </NuxtLayout>
</template>


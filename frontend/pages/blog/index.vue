<script setup lang="ts">
// Meta configuration for SEO
const { t } = useI18n();

useSeoMeta({
    title: () => t('blog.meta.title'),
    description: () => t('blog.meta.description'),
    ogTitle: () => t('blog.meta.title'),
    ogDescription: () => t('blog.meta.description'),
    ogType: 'website',
    twitterCard: 'summary_large_image',
});

// Use the blog composable for centralized state management
const {
    articles,
    recentArticles,
    isLoading,
    isLoadingRecent,
    hasError,
    hasRecentError,
    loadArticles,
    loadRecentArticles
} = useBlog();

// Initialize data on mount
onMounted(async () => {
    await Promise.allSettled([
        loadRecentArticles(),
        loadArticles()
    ]);
});
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full flex-grow">
            <!-- Hero Section with Newsletter -->
            <BlogHeroSection />

            <!-- Recent Articles Section -->
            <BlogRecentSection
                :articles="recentArticles"
                :is-loading="isLoadingRecent"
                :has-error="hasRecentError"
            />

            <!-- All Articles Section -->
            <BlogAllArticlesSection
                :articles="articles"
                :is-loading="isLoading"
                :has-error="hasError"
            />
        </main>
    </NuxtLayout>
</template>


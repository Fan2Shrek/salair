<script setup lang="ts">
    const { t } = useI18n();

    useSeoMeta({
        title: () => t('blog.meta.title'),
        description: () => t('blog.meta.description'),
        ogTitle: () => t('blog.meta.title'),
        ogDescription: () => t('blog.meta.description'),
        ogType: 'website',
        twitterCard: 'summary_large_image',
    });

    const {
        articles,
        recentArticles,
        isLoading,
        isLoadingRecent,
        hasError,
        hasRecentError,
        loadArticles,
        loadRecentArticles,
    } = useBlog();

    onMounted(async () => {
        await Promise.allSettled([loadRecentArticles(), loadArticles()]);
    });
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full flex-grow">
            <BlogHeroSection />

            <BlogRecentSection :articles="recentArticles" :is-loading="isLoadingRecent" :has-error="hasRecentError" />

            <BlogAllArticlesSection :articles="articles" :is-loading="isLoading" :has-error="hasError" />
        </main>
    </NuxtLayout>
</template>


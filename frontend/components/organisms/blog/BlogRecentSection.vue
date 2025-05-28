<script setup lang="ts">
    import type { BlogArticle } from '~/types/blog_article';

    interface BlogRecentSectionProps {
        articles: readonly BlogArticle[];
        isLoading: boolean;
        hasError: boolean;
        onRetry?: () => void;
    }

    defineProps<BlogRecentSectionProps>();

    const { t } = useI18n();
</script>

<template>
    <section class="w-full max-w-6xl mx-auto px-4">
        <h2 class="font-semibold text-2xl text-primary mb-8">
            {{ t('blog.recent.title') }}
        </h2>

        <!-- Loading state -->
        <USkeleton v-if="isLoading" class="h-120 rounded-2xl" />

        <!-- Error state -->
        <div v-else-if="hasError" class="text-center py-12">
            <p class="text-error-primary font-medium">{{ t('blog.recent.error') }}</p>
            <p class="text-tertiary text-sm mt-2">{{ t('blog.recent.error_description') }}</p>
        </div>

        <!-- Content -->
        <div v-else-if="articles.length > 0" class="space-y-8">
            <BlogFeaturedArticle v-if="articles[0]" :article="articles[0]" />

            <!-- Additional recent articles could be displayed here -->
            <div v-if="articles.length > 1" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <BlogArticleCard v-for="article in articles.slice(1)" :key="article.id" :article="article" />
            </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12">
            <p class="text-tertiary">{{ t('blog.recent.empty') }}</p>
        </div>
    </section>
</template>


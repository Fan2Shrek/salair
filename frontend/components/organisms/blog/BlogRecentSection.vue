<script setup lang="ts">
    import type { BlogArticle } from '~/types/blog_article';
import VerticalBlogArticleCard from './VerticalBlogArticleCard.vue';

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
    <section class="w-full max-w-7xl mx-auto px-4">
        <h2 class="font-semibold text-2xl text-primary mb-8">
            {{ t('blog.recent.title') }}
        </h2>

        <USkeleton v-if="isLoading" class="h-120 rounded-2xl" />
        
        <div v-else-if="hasError" class="text-center py-12">
            <p class="text-error-primary font-medium">{{ t('blog.recent.error') }}</p>
            <p class="text-tertiary text-sm mt-2">{{ t('blog.recent.error_description') }}</p>
        </div>

        <div v-else-if="articles.length > 0" class="flex gap-8">
            <BlogFeaturedArticle v-if="articles[0]" :article="articles[0]" />

            <div v-if="articles.length > 1" class="flex flex-col gap-8">
                <VerticalBlogArticleCard v-for="article in articles.slice(1)" :key="article.id" :article="article" />
            </div>
        </div>

        <div v-else class="text-center py-12">
            <p class="text-tertiary">{{ t('blog.recent.empty') }}</p>
        </div>
    </section>
</template>


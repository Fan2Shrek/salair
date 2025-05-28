<script setup lang="ts">
    import type { BlogArticle } from '~/types/blog_article';

    interface BlogAllArticlesSectionProps {
        articles: readonly BlogArticle[];
        isLoading: boolean;
        hasError: boolean;
    }

    defineProps<BlogAllArticlesSectionProps>();

    const { t } = useI18n();
</script>

<template>
    <section class="my-24 max-w-7xl w-full mx-auto px-4 pb-4">
        <h2 class="text-primary font-semibold text-2xl mb-8">
            {{ t('blog.all_articles.title') }}
        </h2>

        <USkeleton v-if="isLoading" class="h-120 rounded-2xl" />

        <div v-else-if="hasError" class="text-center py-12">
            <p class="text-error-primary font-medium">{{ t('blog.all_articles.error') }}</p>
            <p class="text-tertiary text-sm mt-2">{{ t('blog.all_articles.error_description') }}</p>
        </div>

        <div v-else-if="articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BlogArticleCard v-for="article in articles" :key="article.id" :article="article" />
        </div>

        <div v-else class="text-center py-12">
            <p class="text-tertiary">{{ t('blog.all_articles.empty') }}</p>
        </div>
    </section>
</template>


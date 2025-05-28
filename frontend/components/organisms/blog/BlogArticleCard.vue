<script setup lang="ts">
    import type { BlogArticle } from '~/types/blog_article';

    interface BlogArticleCardProps {
        article: BlogArticle;
    }

    defineProps<BlogArticleCardProps>();

    const { d } = useI18n();

    const navigateToArticle = (slug: string) => {
        navigateTo(`/blog/${slug}`);
    };

    const formatAuthorName = (article: BlogArticle) => {
        return `${article.author.firstName} ${article.author.lastName}`;
    };

    const formatDate = (dateString: string) => {
        return d(new Date(dateString), { month: 'short', year: 'numeric', day: 'numeric'});
    };
</script>

<template>
    <article
        class="bg-primary group cursor-pointer max-w-96 w-full"
        tabindex="0"
        role="article"
        :aria-label="`Lire l'article: ${article.slug}`"
        @click="navigateToArticle(article.slug)"
        @keydown.enter="navigateToArticle(article.slug)"
        @keydown.space.prevent="navigateToArticle(article.slug)"
    >
        <div class="overflow-hidden rounded-lg mb-4">
            <img
                :src="article.mainPicture || 'https://storage.salair.fr/salair/public/placeholder.jpg'"
                :alt="`Image de l'article: ${article.slug}`"
                class="object-cover w-full h-64 transition-transform duration-300 ease-in-out group-hover:scale-105"
                loading="lazy"
            />
        </div>

        <div class="space-y-3">
            <p class="text-brand-secondary text-sm font-semibold">
                {{ formatAuthorName(article) }} • {{ formatDate(article.updatedAt) }}
            </p>
            <h3
                class="text-lg font-semibold text-primary line-clamp-2"
            >
                {{ article.slug }}
            </h3>
            <p class="text-tertiary text-sm line-clamp-3">
                {{ $t('blog.article.description_placeholder') }}
            </p>
        </div>
    </article>
</template>


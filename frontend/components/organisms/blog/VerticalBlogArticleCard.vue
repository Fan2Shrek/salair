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
        class="bg-primary group cursor-pointer w-full flex gap-4"
        tabindex="0"
        role="article"
        :aria-label="`Lire l'article: ${article.slug}`"
        @click="navigateToArticle(article.slug)"
        @keydown.enter="navigateToArticle(article.slug)"
        @keydown.space.prevent="navigateToArticle(article.slug)"
    >
        <div class="overflow-hidden rounded-lg w-full">
            <img
                v-if="article.mainPicture"
                :src="article.mainPicture"
                :alt="`Image de l'article: ${article.slug}`"
                class="object-cover w-full min-w-80 max-w-80 max-h-[213px] transition-transform duration-300 ease-in-out group-hover:scale-105"
                loading="lazy"
            />
            <div
                v-else
                class="w-full min-w-80 max-w-80 h-[213px] bg-tertiary rounded-2xl flex items-center justify-center"
                aria-label="Aucune image disponible"
            >
                <p class="text-quaternary text-lg">{{ $t('blog.no_image') }}</p>
            </div>
        </div>

        <div class="w-full">
            <p class="text-brand-secondary text-sm font-semibold">
                {{ formatAuthorName(article) }} • {{ formatDate(article.updatedAt) }}
            </p>
            <h3
                class="text-lg font-semibold text-primary line-clamp-2 mt-2"
            >
                {{ article.title }}
            </h3>
            <p class="text-tertiary text-sm line-clamp-3 mt-1">
                {{ article.description }}
            </p>
        </div>
    </article>
</template>


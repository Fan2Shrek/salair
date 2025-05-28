<script setup lang="ts">
    import type { BlogArticle } from '~/types/blog_article';

    interface BlogFeaturedArticleProps {
        article: BlogArticle;
    }

    defineProps<BlogFeaturedArticleProps>();

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
        class="max-w-140 w-full space-y-4 group cursor-pointer"
        tabindex="0"
        role="article"
        :aria-label="`Lire l'article: ${article.slug}`"
        @click="navigateToArticle(article.slug)"
        @keydown.enter="navigateToArticle(article.slug)"
        @keydown.space.prevent="navigateToArticle(article.slug)"
    >
        <div class="overflow-hidden rounded-2xl">
            <img
                v-if="article.mainPicture"
                :src="article.mainPicture"
                :alt="`Image de l'article: ${article.slug}`"
                class="object-cover w-full h-48 md:h-64 lg:max-h-[395px] transition-transform duration-300 ease-in-out group-hover:scale-110"
                loading="lazy"
            />
            <div
                v-else
                class="w-full h-48 md:h-64 lg:h-[395px] bg-tertiary rounded-2xl flex items-center justify-center"
                aria-label="Aucune image disponible"
            >
                <p class="text-quaternary text-lg">{{ $t('blog.no_image') }}</p>
            </div>
        </div>

        <div class="w-full space-y-2">
            <p class="text-brand-secondary text-sm font-semibold">
                {{ formatAuthorName(article) }} • {{ formatDate(article.updatedAt) }}
            </p>
            <h3 class="text-lg md:text-xl font-semibold text-primary transition-colors">
                {{ article.title }}
            </h3>
            <p class="text-tertiary text-sm md:text-base">
                {{ article.description }}
            </p>
        </div>
    </article>
</template>


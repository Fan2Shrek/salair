import type { BlogArticlePaginated } from "~/types/blog_article_paginated";

export default function useBlog() {
    const articles = ref<BlogArticlePaginated>();
    const toast = useToast();
    const { $api } = useNuxtApp();

    const loadContent = async () => {
        try {
            const { data, error } = await useAuthFetch<BlogArticlePaginated>($api('/api/admin/articles'), {
                method: 'GET'
            })

            if (data.value && !error.value) {
                articles.value = data.value
            } else {
                toast.error('An error occured', error.value?.message || '')
            }
        } catch {
            toast.error('An error occured', '')
        }
    }

    return {
        articles,
        loadContent
    }
}
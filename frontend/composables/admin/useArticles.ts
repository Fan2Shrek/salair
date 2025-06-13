import type { BlogArticle } from "~/types/blog_article";
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

    const publish = async (articleId: BlogArticle["id"]) => {
        try {
            const { data, error } = await useAuthFetch<BlogArticle>($api(`/api/admin/articles/${articleId}`), {
                method: 'PUT',
                body: {
                    status: 'published'
                }
            })

            if (data.value && !error.value) {
                toast.success("L'article a bien été publié", `L'article ${data.value.slug} a bien été publié.`)
                await loadContent();
            }

            if (error.value) {
                toast.error('An error occured', error.value.message)
            }
        } catch {
            toast.error('An error occured', '')
        }
    }

    const archive = async (articleId: BlogArticle["id"]) => {
        try {
            const { data, error } = await useAuthFetch<BlogArticle>($api(`/api/admin/articles/${articleId}`), {
                method: 'PUT',
                body: {
                    status: 'archived'
                }
            });

            if (data.value && !error.value) {
                toast.success("L'article a bien été archivé", `L'article ${data.value.slug} a bien été archivé.`)
                await loadContent();
            }

            if (error.value) {
                toast.error('An error occured', error.value.message)
            }
        } catch {
            toast.error('An error occured', '')
        }
    }

    const deleteArticle = async (articleId: BlogArticle["id"]) => {
        try {
            const { error } = await useAuthFetch($api(`/api/admin/articles/${articleId}`), {
                method: 'DELETE'
            });

            if (!error.value) {
                toast.success("L'article a bien été supprimé", "L'article a bien été supprimé définitivement.")
                await loadContent();
            } else {
                toast.error('An error occured', error.value.message)
            }
        } catch {
            toast.error('An error occured', '')
        }
    }

    return {
        articles,
        loadContent,
        publish,
        archive,
        deleteArticle
    }
}
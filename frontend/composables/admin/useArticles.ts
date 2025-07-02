import type { BlogArticle } from "~/types/blog_article";
import type { BlogArticlePaginated } from "~/types/blog_article_paginated";

export default function useArticles() {
    const { t } = useI18n();
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
                toast.error(t('general.error'), error.value?.message || t('general.error_occurred'))
            }
        } catch {
            toast.error(t('general.error'), t('general.error_occurred'))
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
                toast.success(
                    t('admin.articles.notifications.published'), 
                    t('admin.articles.notifications.published_message', { slug: data.value.slug })
                )
                await loadContent();
            }

            if (error.value) {
                toast.error(t('general.error'), error.value.message)
            }
        } catch {
            toast.error(t('general.error'), t('general.error_occurred'))
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
                toast.success(
                    t('admin.articles.notifications.archived'), 
                    t('admin.articles.notifications.archived_message', { slug: data.value.slug })
                )
                await loadContent();
            }

            if (error.value) {
                toast.error(t('general.error'), error.value.message)
            }
        } catch {
            toast.error(t('general.error'), t('general.error_occurred'))
        }
    }

    const deleteArticle = async (articleId: BlogArticle["id"]) => {
        try {
            const { error } = await useAuthFetch($api(`/api/admin/articles/${articleId}`), {
                method: 'DELETE'
            });

            if (!error.value) {
                toast.success(
                    t('admin.articles.notifications.deleted'), 
                    t('admin.articles.notifications.deleted_message')
                )
                await loadContent();
            } else {
                toast.error(t('general.error'), error.value.message)
            }
        } catch {
            toast.error(t('general.error'), t('general.error_occurred'))
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
import type { ArticlesCollectionItem } from "@nuxt/content"
import type { BlogArticle } from "~/types/blog_article";

export function useBlogArticle(slug: string) {
    const { error: toastError, success: _toastSuccess } = useToast()

    const metadata = ref<BlogArticle>()
    const content = ref<ArticlesCollectionItem | null>();

    const loadContent = async () => {
        const result = await useAsyncData(`${metadata.value?.slug}`, () =>
            queryCollection('articles').path(`/articles/${metadata.value?.slug}`).first()
        );

        content.value = result.data.value
    }

    const fetchArticleMetadata = async () => {
        const { $api } = useNuxtApp()

        try {
            const { data, error } = await useAuthFetch<BlogArticle>($api(`/api/blog/${slug}`), {
                method: 'GET'
            })

            if (data.value && !error.value) {
                metadata.value = data.value
            } else {
                toastError('An error occured', '')
            }
        } catch {
            toastError('An error occured', '')
        }
    }

    return {
        fetchArticleMetadata,
        content,
        loadContent,
        metadata
    }
}
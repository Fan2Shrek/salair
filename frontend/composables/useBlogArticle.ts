import type { ArticlesCollectionItem } from "@nuxt/content"

type BlogArticleMetadata = {
    id: number
    slug: string
    status: 'draw' | 'published' | 'archived'
    visible: boolean
    createdAt: string
    updatedAt: string
}

export function useBlogArticle(slug: string) {
    const { error: toastError, success: _toastSuccess } = useToast()

    const metadata = ref<BlogArticleMetadata>()
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
            const { data, error } = await useAuthFetch<BlogArticleMetadata>($api(`/api/blog/${slug}`), {
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
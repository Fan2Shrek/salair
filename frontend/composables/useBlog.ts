import type { BlogArticle } from '~/types/blog_article';

export function useBlog() {
    const { error: toastError } = useToast();
    
    const isLoading = ref(false);
    const isLoadingRecent = ref(false);
    const articles = ref<BlogArticle[]>([]);
    const recentArticles = ref<BlogArticle[]>([]);
    const hasError = ref(false);
    const hasRecentError = ref(false);

    const loadArticles = async () => {
        isLoading.value = true;
        hasError.value = false;

        const { $api } = useNuxtApp();

        try {
            const { data, error } = await useAuthFetch<BlogArticle[]>($api('/api/blog'), {
                method: 'GET',
            });

            if (data.value && !error.value) {
                articles.value = [...data.value];
            } else {
                hasError.value = true;
                toastError('Erreur de chargement', 'Impossible de charger les articles');
            }
        } catch {
            hasError.value = true;
            toastError('Erreur de chargement', 'Une erreur réseau est survenue');
        } finally {
            isLoading.value = false;
        }
    };

    const loadRecentArticles = async () => {
        isLoadingRecent.value = true;
        hasRecentError.value = false;

        const { $api } = useNuxtApp();

        try {
            const { data, error } = await useAuthFetch<BlogArticle[]>($api('/api/blog?limit=3&order=desc'), {
                method: 'GET',
            });

            if (data.value && !error.value) {
                recentArticles.value = [...data.value];
            } else {
                hasRecentError.value = true;
                toastError('Erreur de chargement', 'Impossible de charger les articles récents');
            }
        } catch {
            hasRecentError.value = true;
            toastError('Erreur de chargement', 'Une erreur réseau est survenue');
        } finally {
            isLoadingRecent.value = false;
        }
    };

    const initializeBlog = async () => {
        await Promise.allSettled([
            loadRecentArticles(),
            loadArticles()
        ]);
    };

    const featuredArticle = computed(() => recentArticles.value[0] || null);

    const hasArticles = computed(() => articles.value.length > 0);
    const hasRecentArticles = computed(() => recentArticles.value.length > 0);

    return {
        // State
        isLoading: readonly(isLoading),
        isLoadingRecent: readonly(isLoadingRecent),
        articles: readonly(articles),
        recentArticles: readonly(recentArticles),
        hasError: readonly(hasError),
        hasRecentError: readonly(hasRecentError),
        
        // Computed
        featuredArticle,
        hasArticles,
        hasRecentArticles,
        
        // Methods
        loadArticles,
        loadRecentArticles,
        initializeBlog,
    };
}

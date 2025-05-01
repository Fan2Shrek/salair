import type { UseFetchOptions } from 'nuxt/app';

export async function useAuthFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
    await nextTick();

    const authStore = useAuthStore();
    const headers = {
        'Authorization': `Bearer ${authStore.accessToken}`
    }

    const finalOptions: UseFetchOptions<T> = {
        ...options,
        headers: {
            ...headers,
            ...(options.headers || {}),
        },
        credentials: 'include',
        immediate: true,
    };

    let response = await useFetch(url, finalOptions);

    if (response.error.value?.statusCode === 401) {
        const refreshed = await authStore.refresh();

        if (refreshed) {
            response = await useFetch(url, finalOptions);
        } else {
            await authStore.logout();
            navigateTo('/login');
        }
    }

    return response;
}

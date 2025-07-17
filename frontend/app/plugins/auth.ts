export default defineNuxtPlugin(async () => {
    const authStore = useAuthStore();

    if (import.meta.client && authStore.isAuthenticated) {
        await authStore.fetchUser();
    }
});

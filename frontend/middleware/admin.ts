export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();

    if (authStore.isAuthenticated && !authStore.user) {
        await authStore.fetchUser();
    }

    if (!authStore.isAuthenticated && to.path !== '/login' && to.path !== '/signup') {
        return navigateTo('/login');
    }

    if (authStore.isAuthenticated && to.path === '/signup') {
        return navigateTo('/');
    }

    if (authStore.isAuthenticated && to.path === '/login') {
        return navigateTo('/');
    }

    if (authStore.user?.role !== 'admin') {
        return navigateTo('/')
    }
});

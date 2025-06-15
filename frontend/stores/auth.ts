import { defineStore } from 'pinia';
import type User from '~/types/user';
import type TokenResponse from '~/types/token_response';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        accessToken: null as string | null,
        refreshToken: null as string | null,
        isAuthenticated: false,
        isLoading: false,
    }),

    actions: {
        async fetchUser() {
            this.isLoading = true;

            try {
                const { $api } = useNuxtApp();

                const { data, error } = await useAuthFetch<User>($api('/api/me'), {
                    method: 'GET',
                    credentials: 'include',
                });

                if (data.value && !error.value) {
                    this.user = data.value;
                    this.isAuthenticated = true;
                } else {
                    this.user = null;
                    this.isAuthenticated = false;
                }
            } catch (error) {
                this.user = null;
                this.isAuthenticated = false;
                console.error('Error fetching user:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async login(email: string, password: string) {
            this.isLoading = true;

            try {
                const { $api } = useNuxtApp();

                const { data, error } = await useFetch<TokenResponse>($api('/api/login'), {
                    method: 'POST',
                    body: { email, password },
                    credentials: 'include',
                });

                if (data.value && !error.value) {
                    this.accessToken = data.value.access_token;
                    this.refreshToken = data.value.refresh_token;

                    await this.fetchUser();
                    return { success: true };
                }

                return {
                    success: false,
                    error: error.value?.message || 'Login failed',
                    data: error.value?.data,
                };
            } catch (error) {
                console.error('Login error:', error);
                return { success: false, error: 'Authentication failed' };
            } finally {
                this.isLoading = false;
            }
        },

        async register({
            firstName,
            lastName,
            email,
            password,
        }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
        }) {
            this.isLoading = true;

            try {
                const { $api } = useNuxtApp();

                const { data, error } = await useAuthFetch<TokenResponse>($api('/api/register'), {
                    method: 'POST',
                    body: {
                        firstName,
                        lastName,
                        email,
                        password,
                    },
                });

                if (data.value && !error.value) {
                    this.accessToken = data.value.access_token;
                    this.refreshToken = data.value.refresh_token;

                    await this.fetchUser();
                    return { success: true };
                }

                return {
                    success: false,
                    error: error.value?.message || 'Register failed',
                    data: error.value?.data,
                };
            } catch {
                return { success: false, error: 'Authentication failed' };
            } finally {
                this.isLoading = false;
            }
        },

        async logout(makeHttpRequest = true) {
            this.isLoading = true;

            try {
                if (makeHttpRequest) {
                    const { $api } = useNuxtApp();

                    await useFetch($api('/api/logout'), {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: {
                            'Authorization': `Bearer ${this.accessToken }`
                        },
                        body: {
                            refreshToken: this.refreshToken,
                        },
                    });
                }

                this.user = null;
                this.accessToken = null;
                this.refreshToken = null;
                this.isAuthenticated = false;
            } catch (error) {
                console.error(error);
                this.$reset();
            } finally {
                this.isLoading = false;
            }
        },

        async refresh(): Promise<boolean> {
            try {
                const { $api } = useNuxtApp();
                const { data, error } = await useFetch<TokenResponse>($api('/api/refresh'), {
                    body: {
                        refresh_token: this.refreshToken,
                    },
                    method: 'POST',
                    credentials: 'include',
                });

                if (data.value && !error.value) {
                    this.accessToken = data.value.access_token;
                    this.refreshToken = data.value.refresh_token;

                    return true;
                } else {
                    return false;
                }
            } catch {
                return false;
            }
        },
    },

    persist: true,
});


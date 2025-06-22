<script setup lang="ts">
    import AlertCircleIcon from '~/components/atoms/icons/AlertCircleIcon.vue';

    definePageMeta({
        middleware: 'auth',
    });

    const authStore = useAuthStore();
    const router = useRouter();
    const { error } = useToast();
    const { handleAuthError } = useErrorHandler();

    // Form state
    const email = ref<string>('');
    const password = ref<string>('');
    const rememberMe = ref<boolean>(false);
    const isLoading = ref<boolean>(false);
    const isSuspendedModalOpen = ref<boolean>(false);

    // Navigation helpers
    const redirectUserAfterLogin = () => {
        if (authStore.user?.role === 'admin') {
            return router.push('/admin/dashboard');
        }

        if (!authStore.user?.company) {
            return router.push('/onboarding');
        }

        return router.push('/app/dashboard');
    };

    const handleLoginError = (result: {
        data?: { errors?: Array<{ message: string }>; message?: string };
        error?: string;
        statusCode?: number;
    }): void => {
        // Check for suspended account
        if (result.statusCode === 403 && result.data?.message === 'Account suspended') {
            isSuspendedModalOpen.value = true;
            return;
        }

        if (result.data?.errors?.length) {
            handleAuthError(result.data.errors[0].message);
            return;
        }

        error('Une erreur est survenue', result.error || 'Erreur de connexion');
    };

    // Main login function
    const login = async (): Promise<void> => {
        if (isLoading.value) return;

        try {
            isLoading.value = true;

            const result = await authStore.login(email.value, password.value);

            if (result.success) {
                await redirectUserAfterLogin();
            } else {
                handleLoginError(result);
            }
        } catch {
            error('Une erreur est survenue', 'Erreur de connexion');
        } finally {
            isLoading.value = false;
        }
    };
</script>

<template>
    <main class="w-full h-full flex flex-col md:flex-row">
        <section class="w-full md:w-1/2 relative flex flex-col md:items-center justify-center px-4 max-md:pt-12 md:p-0">
            <div
                class="flex items-center gap-3 rounded-lg hover:bg-primary-hover p-2 cursor-pointer md:absolute top-8 left-8 md:visible max-md:max-w-sm max-md:w-full max-md:mx-auto"
                @click="navigateTo('/')"
            >
                <ULogo class="size-10 md:size-8" alt="Logo Salair" />
                <p class="text-primary font-semibold text-lg hidden md:block">Salair</p>
            </div>
            <div class="max-w-sm w-full mx-auto max-md:mt-4">
                <div class="space-y-3">
                    <h1 class="text-primary font-semibold text-2xl sm:text-3xl">{{ $t('login.title') }}</h1>
                    <p class="text-tertiary font-normal text-sm sm:text-base">
                        {{ $t('login.subtitle') }}
                    </p>
                </div>
                <form class="mt-8" @submit.prevent="login">
                    <div class="space-y-4 sm:space-y-5">
                        <UInput
                            v-model="email"
                            type="email"
                            name="email"
                            placeholder="Email"
                            :label="$t('login.form.email.label')"
                            required
                        />
                        <UInput
                            v-model="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            :label="$t('login.form.password.label')"
                            required
                        />
                    </div>
                    <div class="mt-6 flex justify-between">
                        <div class="flex gap-2 items-center">
                            <UCheckbox id="remember-check" v-model="rememberMe" size="sm" name="remember-me" />
                            <label for="remember-check" class="text-sm text-secondary font-medium">
                                {{ $t('login.form.remember_me') }}
                            </label>
                        </div>
                        <ULink size="sm" to="/forgot-password">{{ $t('login.form.forgot_password') }}</ULink>
                    </div>
                    <UButton class="mt-5 sm:mt-6 w-full justify-center" type="submit">{{
                        $t('login.form.submit')
                    }}</UButton>
                </form>
            </div>
            <div class="mt-8 flex gap-1 justify-center">
                <p class="text-tertiary">{{ $t('login.no_account') }}</p>
                <ULink to="/signup">{{ $t('general.sign_up') }}</ULink>
            </div>
            <p class="hidden md:block absolute bottom-8 left-8 text-tertiary text-sm">
                © Salair {{ new Date().getFullYear() }} {{ $t('copyright') }}
            </p>
            <div class="hidden md:flex items-center gap-2 absolute bottom-8 right-8">
                <MailIcon class="text-fg-quaternary size-4" />
                <ULink to="mailto:help@salair.fr" class="text-tertiary text-sm">help@salair.fr</ULink>
            </div>
        </section>
        <section class="hidden md:block md:w-1/2 h-full bg-secondary"></section>

        <UBaseModal :is-open="isSuspendedModalOpen" @close="isSuspendedModalOpen = false">
            <div class="px-6 pt-6">
                <UFeaturedIcon :icon="AlertCircleIcon" size="lg" color="error" />
                <div class="space-y-0.5 mt-4">
                    <h3 class="font-semibold text-primary">{{ $t('login.suspended.title') }}</h3>
                    <p class="text-tertiary text-sm">
                        {{ $t('login.suspended.message') }}
                    </p>
                </div>
            </div>
            <div class="pt-8">
                <div class="flex items-center justify-between gap-3 px-6 pb-6">
                    <UButton variant="secondary" class="w-full" @click="isSuspendedModalOpen = false">{{ $t('general.close') }}</UButton>
                    <UButton class="w-full" @click="navigateTo('/contact')">{{ $t('login.suspended.contact_support') }}</UButton>
                </div>
            </div>
        </UBaseModal>
    </main>
</template>


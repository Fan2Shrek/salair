<script setup lang="ts">
    import type { Verify2FAReponseDto } from '~/types/dtos/verify_2fa_response.dto';

    const { email } = useTwoFactorStore();
    const authStore = useAuthStore();
    const toast = useToast();
    const router = useRouter()

    const code = ref<string>();
    const isLoading = ref<boolean>(false);

    async function handleSubmit() {
        isLoading.value = true;
        try {
            const { $api } = useNuxtApp();

            const { data, error } = await useAuthFetch<Verify2FAReponseDto>($api('/api/login/verify-2fa'), {
                method: 'POST',
                body: {
                    email,
                    token: code.value,
                },
            });

            if (data.value && !error.value) {
                authStore.accessToken = data.value.access_token;
                authStore.refreshToken = data.value.refresh_token;

                await authStore.fetchUser();
                toast.success('Successfully connected', '');

                if (authStore.user?.role === 'admin') {
                    router.push('/admin/dashboard');
                } else if (!authStore.user?.company) {
                    router.push('/onboarding');
                } else {
                    router.push('/app/dashboard');
                }
            } else if (error.value) {
                toast.error('An error occured', error.value.message);
            }
        } catch {
            toast.error('', '');
        } finally {
            isLoading.value = false;
        }
    }

    onMounted(() => {
        if (!email) {
            navigateTo('/login');
        }
    });
</script>

<template>
    <main class="h-full w-full relative flex flex-col items-center">
        <UGridBackgroundPattern class="absolute -top-2" />
        <div class="w-full flex flex-col items-center">
            <main class="max-w-90 w-full flex flex-col items-center relative mt-24">
                <div class="p-3.5 rounded-xl bg-primary border border-primary shadow-xs w-fit">
                    <LockIcon class="size-7 text-fg-secondary" />
                </div>

                <div class="mt-6 space-y-3">
                    <h1 class="text-primary font-semibold text-3xl text-center">Authentification à deux facteurs</h1>
                    <p class="text-tertiary text-center">
                        Veuillez saisir le code de vérification à 6 chiffres généré par votre application
                        d'authentification
                    </p>
                </div>

                <form class="w-fit space-y-6 mt-8" @submit.prevent="handleSubmit">
                    <UDigitsInput v-model="code" label="Verification code" />
                    <UButton class="w-full">Submit</UButton>
                </form>
            </main>
        </div>
    </main>
</template>


<script setup>
    definePageMeta({
        middleware: 'auth',
    });

    const authStore = useAuthStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');

    const login = async () => {
        const result = await authStore.login(email.value, password.value);

        if (result.success) {
            router.push('/');
        }
    };
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full h-full flex justify-center px-4 sm:px-6 pt-20 sm:pt-30 md:pt-40 overflow-hidden">
            <UGridBackgroundPattern class="absolute top-0" />
            <section class="flex flex-col items-center space-y-6 sm:space-y-8 relative">
                <div class="text-center space-y-2 sm:space-y-3">
                    <h1 class="text-primary font-semibold text-2xl sm:text-3xl">{{ $t('login.title') }}</h1>
                    <p class="text-tertiary font-normal text-sm sm:text-base">
                        {{ $t('login.subtitle') }}
                    </p>
                </div>
                <form class="w-full max-w-xs sm:max-w-sm md:max-w-md" @submit.prevent="login">
                    <div class="space-y-4 sm:space-y-5">
                        <UInput v-model="email" type="email" name="email" placeholder="Email" :label="$t('login.form.email.label')" required />
                        <UInput
                            v-model="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            :label="$t('login.form.password.label')"
                            required
                        />
                    </div>
                    <UButton class="mt-5 sm:mt-6 w-full justify-center" type="submit">Submit</UButton>
                </form>
            </section>
        </main>
    </NuxtLayout>
</template>


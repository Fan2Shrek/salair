<script setup lang="ts">
    const onboardingStore = useOnboardingStore();
    const email = ref<string>('')
    const router = useRouter()

    function handleSubmit() {
        onboardingStore.email = email.value
        router.push('/onboarding')
    }
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
                    <h1 class="text-primary font-semibold text-2xl sm:text-3xl">{{ $t('signup.title') }}</h1>
                    <p class="text-tertiary font-normal text-sm sm:text-base">{{ $t('signup.subtitle') }}</p>
                </div>
                <form class="mt-8 space-y-4 sm:space-y-5" @submit.prevent="handleSubmit">
                    <UInput
                        v-model="email"
                        type="email"
                        :label="$t('signup.form.email.label')"
                        name="email"
                        :placeholder="$t('signup.form.email.placeholder')"
                        required
                    />
                    <div class="space-y-4 w-full">
                        <UButton type="submit" class="w-full justify-center">{{ $t('signup.form.submit') }}</UButton>
                    </div>
                </form>
            </div>
            <div class="mt-8 flex gap-1 justify-center">
                <p class="text-tertiary">{{ $t('signup.already_account') }}</p>
                <ULink to="/login">{{ $t('general.login') }}</ULink>
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
    </main>
</template>


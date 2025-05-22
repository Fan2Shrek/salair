<script setup lang="ts">
    const email = ref<string>()

    function handleEmailSubmit() {
        console.log('Form submitted !')
    }
</script>

<template>
    <main class="h-full w-full relative flex flex-col items-center">
        <UGridBackgroundPattern class="absolute -top-2" />
        <div class="max-w-90 w-full flex flex-col items-center relative mt-24">
            <div class="p-3.5 rounded-xl bg-primary border border-primary shadow-xs w-fit">
                <KeyIcon class="size-7 text-fg-secondary" />
            </div>
            <div class="mt-6 space-y-3">
                <h1 class="text-primary font-semibold text-3xl text-center">Forgot password?</h1>
                <p class="text-tertiary text-center">No worries, we’ll send you reset instructions.</p>
            </div>
            <form class="w-full space-y-6 mt-8" @submit.prevent="handleEmailSubmit">
                <UInput v-model="email" type="email" placeholder="Enter your email" label="Email" class="w-full" />
                <UButton class="w-full">Reset password</UButton>
            </form>
            <ULink to="/login" class="mt-8" size="sm" variant="secondary">
                <ArrowLeftIcon class="text-fg-quaternary size-5" />
                Back to login
            </ULink>
        </div>
    </main>
</template>


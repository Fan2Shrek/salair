<script setup lang="ts">
    const authStore = useAuthStore();
</script>

<template>
    <div class="fixed top-3 w-full">
            <header
                class="max-w-6xl w-full mx-auto rounded-2xl border border-secondary-alt px-4 py-3 flex items-center bg-primary shadow-xs"
            >
                <div class="flex-grow flex items-center gap-5">
                    <div class="flex items-center gap-3">
                        <ULogo class="size-8" />
                        <p class="text-primary font-semibold text-lg">Salair</p>
                    </div>
                    <nav>
                        <ul class="flex items-center gap-3">
                            <li><ULink to="#" variant="secondary">Product</ULink></li>
                            <li><ULink to="#" variant="secondary">About</ULink></li>
                            <li><ULink to="#" variant="secondary">Pricing</ULink></li>
                        </ul>
                    </nav>
                </div>
                <div v-if="!authStore.isAuthenticated" class="flex items-center gap-3">
                    <UButton variant="secondary" @click="navigateTo('/login')">Log in</UButton>
                    <UButton>Sign in</UButton>
                </div>
                <div v-else class="flex items-center gap-3">
                    <LogoutButton />
                </div>
            </header>
        </div>
</template>
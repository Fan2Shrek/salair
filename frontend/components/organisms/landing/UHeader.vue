<script setup lang="ts">
    const authStore = useAuthStore();
    const isMobileMenuOpen = ref(false);

    function toggleMobileMenu() {
        isMobileMenuOpen.value = !isMobileMenuOpen.value;
    }
</script>

<template>
    <div class="fixed top-3 w-full z-10 px-4 sm:px-6">
        <header
            class="max-w-6xl w-full mx-auto rounded-2xl border border-secondary-alt px-4 py-3 flex items-center justify-between bg-primary shadow-xs"
        >
            <div
                class="flex items-center gap-3 rounded-lg hover:bg-primary-hover p-2 cursor-pointer"
                @click="navigateTo('/')"
            >
                <ULogo class="size-8" />
                <p class="text-primary font-semibold text-lg">Salair</p>
            </div>

            <!-- Navigation principale - visible uniquement sur desktop -->
            <nav class="hidden md:block flex-grow mx-4">
                <ul class="flex items-center gap-6">
                    <li>
                        <ULink to="#" variant="secondary">{{ $t('header.navigation.product') }}</ULink>
                    </li>
                    <li>
                        <ULink to="#" variant="secondary">{{ $t('header.navigation.about') }}</ULink>
                    </li>
                    <li>
                        <ULink to="#" variant="secondary">{{ $t('header.navigation.pricing') }}</ULink>
                    </li>
                </ul>
            </nav>

            <!-- Boutons d'authentification - visibles uniquement sur desktop -->
            <div v-if="!authStore.isAuthenticated" class="hidden md:flex items-center gap-3">
                <LanguageSwitcher format="icon" />
                <UButton variant="secondary" @click="navigateTo('/login')">{{ $t('general.login') }}</UButton>
                <UButton>{{ $t('general.sign_up') }}</UButton>
            </div>
            <div v-else class="hidden md:flex items-center gap-3">
                <LogoutButton />
            </div>

            <!-- Bouton du menu mobile -->
            <button
                class="md:hidden flex items-center justify-center size-10 text-secondary hover:text-secondary-hover"
                aria-label="Toggle menu"
                @click="toggleMobileMenu"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3 12H21M3 6H21M3 18H21"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
        </header>

        <!-- Menu mobile -->
        <div
            v-if="isMobileMenuOpen"
            class="md:hidden fixed inset-0 top-[72px] bg-primary z-20 p-4 shadow-lg border-t border-secondary-alt"
        >
            <nav class="flex flex-col space-y-6">
                <ul class="flex flex-col space-y-4 py-4">
                    <li><ULink to="#" variant="secondary" class="text-lg">Product</ULink></li>
                    <li><ULink to="#" variant="secondary" class="text-lg">About</ULink></li>
                    <li><ULink to="#" variant="secondary" class="text-lg">Pricing</ULink></li>
                </ul>
                <div class="flex flex-col space-y-3 pt-4 border-t border-secondary">
                    <UButton
                        v-if="!authStore.isAuthenticated"
                        variant="secondary"
                        class="w-full"
                        @click="navigateTo('/login')"
                        >Log in</UButton
                    >
                    <UButton v-if="!authStore.isAuthenticated" class="w-full">Sign in</UButton>
                    <LogoutButton v-else />
                </div>
            </nav>
        </div>
    </div>
</template>


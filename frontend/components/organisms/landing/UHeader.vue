<script setup lang="ts">
    const authStore = useAuthStore();
    const isMobileMenuOpen = ref(false);

    function toggleMobileMenu() {
        isMobileMenuOpen.value = !isMobileMenuOpen.value;
    }
</script>

<template>
    <div class="fixed md:top-3 w-full z-10 px-4 sm:px-6">
        <header
            class="md:max-w-6xl w-full max-w-screen-md md:mx-auto rounded-2xl md:border border-secondary-alt md:px-4 py-3 flex items-center justify-between md:bg-primary md:shadow-xs"
            role="banner"
        >
            <div
                class="flex items-center gap-3 rounded-lg hover:bg-primary-hover p-2 cursor-pointer"
                @click="navigateTo('/')"
            >
                <ULogo class="size-8" alt="Logo Salair" />
                <p class="text-primary font-semibold text-lg">Salair</p>
            </div>

            <nav class="hidden md:block flex-grow mx-4" aria-label="Navigation principale">
                <ul class="flex items-center gap-6">
                    <li>
                        <ULink to="/product" variant="secondary">{{ $t('header.navigation.product') }}</ULink>
                    </li>
                    <li>
                        <ULink to="/about" variant="secondary">{{ $t('header.navigation.about') }}</ULink>
                    </li>
                    <li>
                        <ULink to="/pricing" variant="secondary">{{ $t('header.navigation.pricing') }}</ULink>
                    </li>
                </ul>
            </nav>

            <!-- Boutons d'authentification - visibles uniquement sur desktop -->
            <div v-if="!authStore.isAuthenticated" class="hidden md:flex items-center gap-3">
                <LanguageSwitcher format="icon" />
                <UButton variant="secondary" @click="navigateTo('/login')">{{ $t('general.login') }}</UButton>
                <UButton @click="navigateTo('/signup')">{{ $t('general.sign_up') }}</UButton>
            </div>
            <div v-else class="hidden md:flex items-center gap-3">
                <LanguageSwitcher format="icon" />
                <UButton v-if="authStore.isAuthenticated" variant="secondary" @click="navigateTo('/app/dashboard')"
                    >{{ $t('sidebar.dashboard') }}</UButton
                >
                <LogoutButton />
            </div>

            <!-- Bouton du menu mobile -->
            <button
                class="md:hidden flex items-center justify-center size-10 text-secondary hover:text-secondary-hover"
                aria-label="Toggle menu"
                :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
                aria-controls="mobile-menu"
                @click="toggleMobileMenu"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
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
            id="mobile-menu"
            class="md:hidden fixed inset-0 top-[72px] bg-primary z-20 p-4 shadow-lg border-t border-secondary-alt"
            role="dialog"
            aria-modal="true"
            aria-label="Menu mobile"
        >
            <nav class="flex flex-col space-y-6" aria-label="Navigation mobile">
                <ul class="flex flex-col space-y-4 py-4">
                    <li><ULink to="#" variant="secondary" class="text-lg">{{ $t('header.navigation.product') }}</ULink></li>
                    <li><ULink to="#" variant="secondary" class="text-lg">{{ $t('header.navigation.about') }}</ULink></li>
                    <li><ULink to="/pricing" variant="secondary" class="text-lg">{{ $t('header.navigation.pricing') }}</ULink></li>
                </ul>
                <div class="flex flex-col space-y-3 pt-4 border-t border-secondary">
                    <UButton
                        v-if="!authStore.isAuthenticated"
                        variant="secondary"
                        class="w-full"
                        @click="navigateTo('/login')"
                        >{{ $t('general.login') }}</UButton
                    >
                    <UButton v-if="authStore.isAuthenticated" variant="secondary" @click="navigateTo('/app/dashboard')"
                        >{{ $t('sidebar.dashboard') }}</UButton
                    >
                    <UButton v-if="!authStore.isAuthenticated" class="w-full" @click="navigateTo('/signup')"
                        >{{ $t('general.sign_up') }}</UButton
                    >
                    <LogoutButton v-else />
                </div>
            </nav>
        </div>
    </div>
</template>


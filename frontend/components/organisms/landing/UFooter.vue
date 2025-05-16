<script setup lang="ts"></script>

<template>
    <footer class="w-full pt-12 md:pt-16 pb-12 bg-secondary">
        <div class="max-w-7xl w-full mx-auto">
            <div class="w-full md:flex justify-between">
                <div class="space-y-8 max-md:px-4">
                    <div
                        class="flex items-center gap-3 rounded-lg hover:bg-primary-hover p-2 cursor-pointer w-fit"
                        @click="navigateTo('/')"
                    >
                        <ULogo class="size-8" alt="Logo Salair" />
                        <p class="text-primary font-semibold text-lg">Salair</p>
                    </div>
                    <nav>
                        <ul class="w-full flex items-center gap-8">
                            <li>
                                <ULink to="#" variant="secondary">{{ $t('header.navigation.product') }}</ULink>
                            </li>
                            <li>
                                <ULink to="#" variant="secondary">{{ $t('header.navigation.about') }}</ULink>
                            </li>
                            <li>
                                <ULink to="/pricing" variant="secondary">{{ $t('header.navigation.pricing') }}</ULink>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="space-y-4 max-md:mt-12 max-md:px-4">
                    <h4 class="font-semibold text-primary text-sm">{{ $t('footer.stay_updated') }}</h4>
                    <form class="flex items-center gap-4">
                        <UInput type="email" name="email" :placeholder="$t('footer.email_placeholder')" class="max-md:flex-grow"/>
                        <UButton size="lg">{{ $t('footer.subscribe') }}</UButton>
                    </form>
                </div>
            </div>
            <div class="mt-16 pt-8 flex max-md:flex-col-reverse md:justify-between max-md:gap-4 border-t border-secondary max-md:px-4">
                <p class="text-quaternary">© {{ new Date().getFullYear() }} Salair. {{ $t('copyright') }}</p>
                <nav>
                    <ul class="flex items-center gap-4">
                        <li>
                            <NuxtLink to="/terms" variant="secondary" class="!text-quaternary">{{ $t('footer.terms') }}</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/privacy" variant="secondary" class="!text-quaternary">{{ $t('footer.privacy') }}</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/cookies" variant="secondary" class="!text-quaternary">{{ $t('footer.cookies') }}</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/sales" variant="secondary" class="!text-quaternary">{{ $t('footer.terms_of_sales') }}</NuxtLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </footer>
</template>


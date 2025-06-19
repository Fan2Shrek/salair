<script setup lang="ts">
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';
    import type { TabItem } from '~/components/molecules/UTabs.vue';

    definePageMeta({
        middleware: 'auth',
    });

    type ColorModePreference = 'system' | 'light' | 'dark';

    const authStore = useAuthStore();
    const { t } = useI18n();
    const colorMode = useColorMode();

    const {
        firstName,
        lastName,
        email,
        avatar: _avatar,
        isSaveable,
        handleUpload,
        handleSaveDetails,
        handleSaveAppearance,
    } = useSettings();

    useSeoMeta({
        title: t('sidebar.settings'),
    });

    const tabs: TabItem[] = [
        {
            label: t('settings.tabs.details'),
            name: 'details',
        },
        {
            label: t('settings.tabs.password'),
            name: 'password',
        },
        {
            label: t('settings.tabs.billing'),
            name: 'billing',
        },
        {
            label: t('settings.tabs.appearance'),
            name: 'appearance',
        },
        {
            label: t('settings.tabs.security'),
            name: 'security',
        },
    ];
</script>

<template>
    <NuxtLayout name="app">
        <main class="flex-grow h-full pt-8 pb-12">
            <section class="w-full px-8 space-y-5">
                <div class="flex justify-between items-center">
                    <h1 class="font-semibold text-2xl text-primary">{{ t('sidebar.settings') }}</h1>
                    <UInput type="search" :placeholder="t('general.search')" :icon="SearchIcon" />
                </div>
                <UTabs :items="tabs" full-width variant="border">
                    <template #details>
                        <section class="mt-8 w-full">
                            <div class="w-full flex pb-5 border-b border-secondary">
                                <div class="space-y-0.5 flex-grow">
                                    <h2 class="text-primary font-semibold text-lg">
                                        {{ t('settings.personal_info.title') }}
                                    </h2>
                                    <p class="text-tertiary text-sm">{{ t('settings.personal_info.description') }}</p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <UButton variant="secondary">{{ t('settings.buttons.cancel') }}</UButton>
                                    <UButton :disabled="!isSaveable" @click="handleSaveDetails">{{
                                        t('settings.buttons.save')
                                    }}</UButton>
                                </div>
                            </div>
                            <form class="mt-6 w-full space-y-6" @submit.prevent="handleSaveDetails">
                                <div class="flex gap-8">
                                    <div class="min-w-52 max-w-72 w-full flex gap-0.5">
                                        <label class="text-sm text-primary font-semibold">{{
                                            t('settings.personal_info.form.name.label')
                                        }}</label>
                                        <span class="text-brand-tertiary font-semibold text-sm">*</span>
                                    </div>
                                    <div class="flex gap-6 max-w-lg w-full">
                                        <UInput v-model="firstName" name="firstName" type="text" class="w-full" />
                                        <UInput v-model="lastName" name="lastName" type="text" class="w-full" />
                                    </div>
                                </div>
                                <UDivider class="w-full" orientation="horizontal" />
                                <div class="flex gap-8">
                                    <div class="min-w-52 max-w-72 w-full flex gap-0.5">
                                        <label class="text-sm text-primary font-semibold">{{
                                            t('settings.personal_info.form.email.label')
                                        }}</label>
                                        <span class="text-brand-tertiary font-semibold text-sm">*</span>
                                    </div>
                                    <div class="flex gap-6 max-w-lg w-full">
                                        <UInput v-model="email" name="email" type="email" class="w-full" />
                                    </div>
                                </div>
                                <UDivider class="w-full" orientation="horizontal" />
                                <div class="flex gap-8">
                                    <div class="min-w-52 max-w-72 w-full">
                                        <div class="flex gap-1 items-center">
                                            <label class="text-sm text-primary font-semibold">{{
                                                t('settings.personal_info.form.photo.label')
                                            }}</label>
                                            <UTooltip :text="t('settings.personal_info.form.photo.tooltip')">
                                                <HelpCircleIcon class="size-4 text-fg-quaternary" />
                                            </UTooltip>
                                        </div>
                                        <p class="text-tertiary text-sm">
                                            {{ t('settings.personal_info.form.photo.description') }}
                                        </p>
                                    </div>
                                    <div class="flex gap-6 max-w-lg w-full">
                                        <UAvatar
                                            v-if="authStore.user?.avatar"
                                            size="2xl"
                                            :image-src="authStore.user?.avatar"
                                        />
                                        <UAvatar
                                            v-else
                                            size="2xl"
                                            :text="authStore.user!.firstName[0] + authStore.user!.lastName[0]"
                                        />
                                        <UFileInput class="w-full" @update:file="handleUpload" />
                                    </div>
                                </div>
                                <UDivider class="w-full" orientation="horizontal" />
                            </form>
                        </section>
                    </template>
                    <template #appearance>
                        <section class="mt-8 w-full">
                            <div class="w-full flex pb-5 border-b border-secondary">
                                <div class="space-y-0.5 flex-grow">
                                    <h2 class="text-primary font-semibold text-lg">
                                        {{ t('settings.appearance.title') }}
                                    </h2>
                                    <p class="text-tertiary text-sm">{{ t('settings.appearance.description') }}</p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <UButton variant="secondary">{{ t('settings.buttons.cancel') }}</UButton>
                                    <UButton :disabled="!isSaveable" @click="handleSaveAppearance">{{
                                        t('settings.buttons.save')
                                    }}</UButton>
                                </div>
                            </div>
                            <form class="mt-6 w-full space-y-6" @submit.prevent="handleSaveAppearance">
                                <div class="flex gap-8">
                                    <div class="min-w-52 max-w-72 w-full flex flex-col">
                                        <label class="text-sm text-primary font-semibold">{{ t('settings.appearance.display_preference.label') }}</label>
                                        <p class="text-sm text-tertiary">{{ t('settings.appearance.display_preference.description') }}</p>
                                    </div>
                                    <div class="flex gap-6 max-w-lg w-full">
                                        <ClientOnly>
                                            <UColorModeSwitch v-model="colorMode.preference as ColorModePreference" />
                                        </ClientOnly>
                                    </div>
                                </div>
                                <UDivider class="w-full" orientation="horizontal" />
                            </form>
                        </section>
                    </template>
                    <template #security>
                        <section class="mt-8 w-full">
                            <div class="w-full flex pb-5 border-b border-secondary">
                                <div class="space-y-0.5 flex-grow">
                                    <h2 class="text-primary font-semibold text-lg">{{ t('settings.security.title') }}</h2>
                                    <p class="text-tertiary text-sm">
                                        {{ t('settings.security.description') }}
                                    </p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <UButton variant="secondary">{{ t('settings.buttons.cancel') }}</UButton>
                                    <UButton :disabled="!isSaveable" @click="handleSaveDetails">{{
                                        t('settings.buttons.save')
                                    }}</UButton>
                                </div>
                            </div>
                            <form class="mt-6 w-full space-y-6" @submit.prevent="handleSaveAppearance">
                                <div class="flex gap-8">
                                    <div class="min-w-52 max-w-72 w-full flex flex-col">
                                        <label class="text-sm text-primary font-semibold">{{ t('settings.security.two_factor.label') }}</label>
                                        <p class="text-sm text-tertiary">{{ t('settings.security.two_factor.description') }}</p>
                                    </div>
                                    <div class="flex gap-6 max-w-lg w-full">
                                        <U2FAModal />
                                    </div>
                                </div>
                            </form>
                        </section>
                    </template>
                </UTabs>
            </section>
        </main>
    </NuxtLayout>
</template>


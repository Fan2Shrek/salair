<script setup lang="ts">
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';
    import type { TabItem } from '~/components/molecules/UTabs.vue';
    import type User from '~/types/user';

    definePageMeta({
        middleware: 'auth',
    });

    const authStore = useAuthStore();
    const { t } = useI18n();
    const firstName = ref<string>(authStore.user?.firstName || '');
    const lastName = ref<string>(authStore.user?.lastName || '');
    const email = ref<string>(authStore.user?.email || '');
    const avatar = ref<File>();
    const { error: toastError, success: toastSuccess } = useToast();
    const { upload, isSuccess, responseData } = useFileUploadProgress();
    const { $api } = useNuxtApp();

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
    ];

    const isSaveable = computed(() => {
        if (firstName.value !== authStore.user?.firstName) return true;
        if (lastName.value !== authStore.user?.lastName) return true;
        if (email.value !== authStore.user.email) return true;
        if (avatar.value) return true;

        return false;
    });

    function handleUpload(file: File | null) {
        if (file) {
            if (!file.type.startsWith('image/')) {
                toastError(t('general.error'), t('onboarding.billing.form.logo.errors.invalid_image'));
                return;
            }

            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                toastError(t('general.error'), t('onboarding.billing.form.logo.errors.file_too_large'));
                return;
            }

            avatar.value = file;
        }
    }

    async function handleSubmit() {
        if (!isSaveable.value) return;

        if (
            firstName.value !== authStore.user?.firstName ||
            lastName.value !== authStore.user?.lastName ||
            email.value !== authStore.user?.email
        ) {
            const payload = {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
            };

            const { data, error } = await useAuthFetch<User>($api('/api/me'), {
                method: 'PUT',
                body: payload,
            });

            if (data.value && !error.value) {
                toastSuccess('Bravo!', 'Votre profil a bien été mis à jour !');

                authStore.user = data.value;
            }
        }

        if (avatar.value) {
            await upload(avatar.value, $api(`/api/me/avatar`));

            if (isSuccess.value && responseData.value) {
                authStore.user!.avatar = responseData.value.avatar_url as string;
            }
        }
    }
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
                                    <UButton :disabled="!isSaveable" @click="handleSubmit">{{
                                        t('settings.buttons.save')
                                    }}</UButton>
                                </div>
                            </div>
                            <form class="mt-6 w-full space-y-6" @submit.prevent="handleSubmit">
                                <div class="flex gap-8">
                                    <div class="min-w-52 max-w-72 w-full flex gap-0.5">
                                        <label class="text-sm text-primary font-semibold">{{ t('settings.personal_info.form.name.label') }}</label>
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
                                        <label class="text-sm text-primary font-semibold">{{ t('settings.personal_info.form.email.label') }}</label>
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
                                            <label class="text-sm text-primary font-semibold">{{ t('settings.personal_info.form.photo.label') }}</label>
                                            <UTooltip :text="t('settings.personal_info.form.photo.tooltip')">
                                                <HelpCircleIcon class="size-4 text-fg-quaternary" />
                                            </UTooltip>
                                        </div>
                                        <p class="text-tertiary text-sm">{{ t('settings.personal_info.form.photo.description') }}</p>
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
                </UTabs>
            </section>
        </main>
    </NuxtLayout>
</template>


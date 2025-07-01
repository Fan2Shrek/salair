<script lang="ts" setup>
    import DownloadIcon from '~/components/atoms/icons/DownloadIcon.vue';
    import PlusIcon from '~/components/atoms/icons/PlusIcon.vue';

    definePageMeta({
        middleware: 'admin',
    });
</script>

<template>
    <NuxtLayout name="app">
        <main class="h-full w-full pt-8 pb-12">
            <header class="px-8">
                <div class="space-y-4">
                    <div class="flex items-center gap-1">
                        <div class="p-1">
                            <HomeIcon class="size-5 text-fg-quaternary" />
                        </div>
                        <ChevronRightIcon class="text-fg-quaternary size-4" />
                        <div class="py-1 px-2">
                            <ULink
                                to="/admin/companies"
                                variant="secondary"
                                class="text-quaternary font-semibold text-sm"
                                >Companies</ULink
                            >
                        </div>
                    </div>
                    <div class="flex gap-4 border-b border-secondary pb-4">
                        <div class="space-y-1 flex-grow">
                            <h1 class="font-semibold text-primary text-2xl">Companies</h1>
                            <p class="text-tertiary">Manage companies and their information</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <UButton variant="secondary" :icon="DownloadIcon" icon-position="leading" disabled>{{
                                $t('admin.users.export')
                            }}</UButton>
                            <UButton :icon="PlusIcon" icon-position="leading" disabled>{{
                                $t('admin.users.add_user')
                            }}</UButton>
                        </div>
                    </div>
                </div>
            </header>
        </main></NuxtLayout
    >
</template>

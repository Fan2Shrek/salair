<script setup lang="ts">
    import SettingsIcon from '~/components/atoms/icons/SettingsIcon.vue';
    import USidebarHeader from '~/components/molecules/app/USidebarHeader.vue';
    import USidebarNavigation from '~/components/molecules/app/USidebarNavigation.vue';
    import UUserProfileMenu from '~/components/molecules/app/UUserProfileMenu.vue';

    const authStore = useAuthStore();
    const { t } = useI18n();
</script>

<template>
    <aside class="fixed top-0 left-0 h-full border-r border-secondary bg-primary max-w-xs w-full">
        <div class="pt-6 flex flex-col h-full">
            <USidebarHeader />
            <USidebarNavigation />
            <div class="px-4 pb-6 w-full space-y-3">
                <nav class="w-full mt-1 space-y-1">
                    <ul class="w-full">
                        <USidebarItem :title="t('sidebar.settings')" :icon="SettingsIcon" to="/app/settings" />
                    </ul>
                </nav>
                <UUserProfileMenu v-if="authStore.user" :user="authStore.user" />
            </div>
        </div>
    </aside>
</template>


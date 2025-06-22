<script setup lang="ts">
    import MessageChatCircleIcon from '~/components/atoms/icons/MessageChatCircleIcon.vue';
    import SettingsIcon from '~/components/atoms/icons/SettingsIcon.vue';
    import USidebarHeader from '~/components/molecules/app/USidebarHeader.vue';
    import USidebarNavigation from '~/components/molecules/app/USidebarNavigation.vue';
    import UUserProfileMenu from '~/components/molecules/app/UUserProfileMenu.vue';
    import XIcon from '~/components/atoms/icons/XIcon.vue';

    const props = defineProps<{
        isMobileOpen: boolean;
    }>();

    const emit = defineEmits(['close']);

    const authStore = useAuthStore();
    const { t } = useI18n();

    const mobileSidebarClass = computed(() => {
        return props.isMobileOpen ? 'translate-x-0' : '-translate-x-full';
    });
</script>

<template>
    <!-- Desktop Sidebar (hidden on mobile) -->
    <aside class="fixed top-0 left-0 h-full border-r border-secondary bg-primary w-80 hidden lg:block z-20">
        <div class="pt-6 flex flex-col h-full">
            <USidebarHeader />
            <USidebarNavigation />
            <div class="px-4 pb-6 w-full space-y-3">
                <nav class="w-full mt-1 space-y-1">
                    <ul class="w-full">
                        <USidebarItem :title="t('sidebar.settings')" :icon="SettingsIcon" to="/app/settings" />
                    </ul>
                    <ul class="w-full">
                        <USidebarItem :title="t('sidebar.support')" :icon="MessageChatCircleIcon" to="/app/support" />
                    </ul>
                </nav>
                <UUserProfileMenu v-if="authStore.user" :user="authStore.user" />
            </div>
        </div>
    </aside>

    <!-- Mobile Sidebar (slides in from left) -->
    <aside
        :class="[
            'fixed top-0 left-0 h-full border-r border-secondary bg-primary w-80 z-40 transition-transform duration-300 ease-in-out lg:hidden',
            mobileSidebarClass,
        ]"
    >
        <div class="pt-3 flex flex-col h-full">
            <div class="flex justify-between items-center px-4 mb-3">
                <div class="flex items-center gap-3">
                    <ULogo class="size-6" alt="Logo Salair" />
                    <p class="text-primary font-semibold">Salair</p>
                </div>
                <button class="p-2" @click="emit('close')">
                    <component :is="XIcon" class="size-5 text-fg-quaternary" />
                </button>
            </div>
            <div class="px-4">
                <form class="w-full">
                    <UInput type="search" icon-position="leading" class="w-full" :placeholder="t('general.search')" />
                </form>
            </div>
            <USidebarNavigation />
            <div class="px-4 pb-6 w-full space-y-3">
                <nav class="w-full mt-1 space-y-1">
                    <ul class="w-full">
                        <USidebarItem :title="t('sidebar.settings')" :icon="SettingsIcon" to="/app/settings" />
                    </ul>
                    <ul class="w-full">
                        <USidebarItem :title="t('sidebar.support')" :icon="MessageChatCircleIcon" to="/app/support" />
                    </ul>
                </nav>
                <UUserProfileMenu v-if="authStore.user" :user="authStore.user" />
            </div>
        </div>
    </aside>
</template>


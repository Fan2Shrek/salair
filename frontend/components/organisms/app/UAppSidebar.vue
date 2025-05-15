<script setup lang="ts">
    import USidebarHeader from '~/components/molecules/app/USidebarHeader.vue';
    import USidebarNavigation from '~/components/molecules/app/USidebarNavigation.vue';
    import UUserProfileMenu from '~/components/molecules/app/UUserProfileMenu.vue';

    const authStore = useAuthStore();
</script>

<template>
    <aside class="fixed top-0 left-0 h-full border-r border-secondary bg-primary max-w-xs w-full">
        <div class="pt-6 flex flex-col h-full">
            <USidebarHeader />
            <USidebarNavigation />
            <div class="px-4 pb-6 w-full">
                <UUserProfileMenu :user="authStore.user!" />
            </div>
        </div>
    </aside>
</template>


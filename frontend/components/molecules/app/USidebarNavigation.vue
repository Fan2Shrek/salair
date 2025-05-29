<script setup lang="ts">
    import HomeIcon from '~/components/atoms/icons/HomeIcon.vue';
    import ChartIcon from '~/components/atoms/icons/ChartIcon.vue';
    import FileIcon from '~/components/atoms/icons/FileIcon.vue';
    import USidebarItem from '~/components/atoms/USidebarItem.vue';

    const { t } = useI18n();
    const authStore = useAuthStore();

    const isAdmin = computed(() => {
        return authStore.user?.role === 'admin';
    });

    const navLinks = [
        {
            title: t('sidebar.dashboard'),
            link: '/app/dashboard',
            icon: ChartIcon,
        },
    ];

    const adminLinks = [
        {
            title: 'Articles',
            link: '/admin/articles',
            icon: FileIcon,
        },
    ];
</script>

<template>
    <div class="mt-4 px-4 flex-grow">
        <nav class="w-full">
            <ul class="w-full">
                <USidebarItem :title="$t('sidebar.home')" :icon="HomeIcon" to="/" />
            </ul>
        </nav>
        <UDivider class="mt-1" />
        <nav class="w-full mt-1 space-y-1">
            <ul v-for="navLink in navLinks" :key="navLink.title" class="w-full">
                <USidebarItem :title="navLink.title" :icon="navLink.icon" :to="navLink.link" />
            </ul>
        </nav>
        <UDivider v-if="isAdmin" class="mt-1" />
        <nav v-if="isAdmin" class="w-full mt-1 space-y-1">
            <ul v-for="link in adminLinks" :key="link.title" class="w-full">
                <USidebarItem :title="link.title" :icon="link.icon" :to="link.link" />
            </ul>
        </nav>
    </div>
</template>


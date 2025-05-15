<script setup lang="ts">
    import HomeIcon from '~/components/atoms/icons/HomeIcon.vue';
    import ChartIcon from '~/components/atoms/icons/ChartIcon.vue';

    const { t } = useI18n();

    const navLinks = [
        {
            title: t('sidebar.dashboard'),
            link: '/app/dashboard',
            icon: ChartIcon,
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
    </div>
</template>


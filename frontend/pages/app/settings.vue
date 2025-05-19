<script setup lang="ts">
    import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';
    import type { TabItem } from '~/components/molecules/UTabs.vue';

    definePageMeta({
        middleware: 'auth',
        pageTransition: {
            name: 'page',
            mode: 'out-in',
        },
    });

    useSeoMeta({
        title: 'Settings',
    });

    const tabs: TabItem[] = [
        {
            label: 'My details',
            name: 'details',
        },
        {
            label: 'Password',
            name: 'password',
        },
        {
            label: 'Billing',
            name: 'billing',
        },
    ];
</script>

<template>
    <NuxtLayout name="app">
        <main class="flex-grow h-full pt-8 pb-12">
            <header class="w-full px-8 space-y-5">
                <div class="flex justify-between items-center">
                    <h1 class="font-semibold text-2xl text-primary">Settings</h1>
                    <UInput type="search" :placeholder="$t('general.search')" :icon="SearchIcon" />
                </div>
                <UTabs :items="tabs" full-width variant="border" />
            </header>
        </main>
    </NuxtLayout>
</template>

<style>
    .page-enter-active,
    .page-leave-active {
        transition: all 0.4s ease;
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .page-enter-from {
        opacity: 0;
        transform: translate(40px, 40px) scale(0.98); /* arrive du bas-droit */
    }

    .page-enter-to {
        opacity: 1;
        transform: translate(0, 0) scale(1);
    }

    .page-leave-from {
        opacity: 1;
        transform: translate(0, 0) scale(1);
    }

    .page-leave-to {
        opacity: 0;
        transform: translate(40px, 40px) scale(0.98); /* part vers bas-droit */
    }
</style>

<script setup lang="ts">
import HomeIcon from '~/components/atoms/icons/HomeIcon.vue';
import SearchIcon from '~/components/atoms/icons/SearchIcon.vue';

</script>

<template>
    <aside class="fixed top-0 left-0 h-full border-r border-secondary bg-primary max-w-xs w-full overflow-y-auto">
        <div class="pt-6">
            <div class="px-5 space-y-5">
                <div
                    class="flex items-center gap-3 rounded-lg hover:bg-primary-hover p-2 cursor-pointer"
                    @click="navigateTo('/')"
                >
                    <ULogo class="size-8" alt="Logo Salair" />
                    <p class="text-primary font-semibold text-lg">Salair</p>
                </div>
                <form class="w-full">
                    <UInput
                        type="search"
                        :icon="SearchIcon"
                        icon-position="leading"
                        class="w-full"
                        placeholder="Search"
                    />
                </form>
            </div>
            <div class="mt-4 px-4">
                <nav class="w-full">
                    <ul class="w-full">
                        <USidebarItem title="Home" :icon="HomeIcon" to="/" />
                    </ul>
                </nav>
            </div>
        </div>
    </aside>
</template>

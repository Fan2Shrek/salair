<script setup lang="ts">
import USidebarItem from '~/components/atoms/USidebarItem.vue'

const authStore = useAuthStore()
const { homeNavLink, clientNavLinks, adminNavLinks } = useNavigation()

const isAdmin = computed(() => authStore.user?.role === 'admin')
</script>

<template>
    <div class="mt-4 px-4 flex-grow">
        <nav class="w-full">
            <ul class="w-full">
                <USidebarItem 
                    :title="homeNavLink.title" 
                    :icon="homeNavLink.iconComponent" 
                    :to="homeNavLink.link" />
            </ul>
        </nav>
        <UDivider class="mt-1" />

        <nav v-if="!isAdmin" class="w-full mt-1 space-y-1">
            <ul v-for="navLink in clientNavLinks" :key="navLink.title" class="w-full">
                <USidebarItem :title="navLink.title" :icon="navLink.iconComponent" :to="navLink.link" />
            </ul>
        </nav>

        <nav v-if="isAdmin" class="w-full mt-1 space-y-1">
            <ul v-for="navLink in adminNavLinks" :key="navLink.title" class="w-full">
                <USidebarItem :title="navLink.title" :icon="navLink.iconComponent" :to="navLink.link" />
            </ul>
        </nav>
    </div>
</template>


<script setup lang="ts">
    import MenuIcon from '~/components/atoms/icons/MenuIcon.vue';

    const isSidebarOpen = ref(false);

    const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
    };

    // Close sidebar with ESC key
    onMounted(() => {
        if (import.meta.client) {
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && isSidebarOpen.value) {
                    isSidebarOpen.value = false;
                }
            });
        }
    });

    onUnmounted(() => {
        if (import.meta.client) {
            window.removeEventListener('keydown', (e) => {
                if (e.key === 'Escape' && isSidebarOpen.value) {
                    isSidebarOpen.value = false;
                }
            });
        }
    });

    // Hide sidebar on mobile when route changes
    const route = useRoute();
    watch(
        () => route.path,
        () => {
            if (import.meta.client && window.innerWidth < 1024) {
                isSidebarOpen.value = false;
            }
        }
    );
</script>

<template>
    <div class="w-full h-full">
        <!-- Mobile Header with Burger Menu -->
        <div
            class="lg:hidden fixed top-0 left-0 w-full bg-primary border-b border-secondary z-30 px-4 py-3 flex items-center justify-between"
        >
            <div class="flex items-center gap-3" @click="navigateTo('/')">
                <ULogo class="size-6" alt="Logo Salair" />
                <p class="text-primary font-semibold">Salair</p>
            </div>
            <button class="p-2" @click="toggleSidebar">
                <MenuIcon class="size-6 text-primary" />
            </button>
        </div>

        <!-- Backdrop for mobile sidebar -->
        <div v-if="isSidebarOpen" class="fixed inset-0 bg-black/50 z-30 lg:hidden" @click="toggleSidebar"></div>

        <!-- Responsive Sidebar -->
        <UAppSidebar :is-mobile-open="isSidebarOpen" @close="toggleSidebar" />

        <!-- Content Area -->
        <div class="lg:pl-80 h-full w-full pt-14 lg:pt-0">
            <slot />
        </div>
    </div>
</template>


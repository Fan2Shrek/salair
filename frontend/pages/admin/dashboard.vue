<script setup lang="ts">
    definePageMeta({
        middleware: 'admin',
        layout: 'app',
    });

    const { user } = useAuthStore();
</script>

<template>
    <main v-if="user" class="w-full h-full pt-8">
        <div class="flex pl-8">
            <div class="flex gap-4 flex-grow items-center">
                <UAvatar v-if="user?.avatar" size="xl" :image-src="user?.avatar" />
                <UAvatar v-else size="xl" :text="user.firstName[0] + user.lastName[0]" />
                <div>
                    <h3 class="text-primary font-semibold">Welcome back, {{ user.firstName }}</h3>
                    <p class="text-tertiary">{{ $d(Date.now(), { month: 'short', year: 'numeric', day: 'numeric' }) }}</p>
                </div>
            </div>
        </div>

    </main>
</template>


<script setup lang="ts">
    definePageMeta({
        middleware: 'admin',
        layout: 'app',
    });

    const { t } = useI18n();
</script>

<template>
    <main class="p-6">
        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-primary">{{ t('admin.users.title') }}</h1>
                <p class="text-tertiary mt-1">{{ t('admin.users.subtitle') }}</p>
            </div>

            <div class="bg-primary border border-secondary rounded-lg p-6">
                <p class="text-center text-tertiary">{{ t('admin.users.coming_soon') }}</p>
            </div>
        </div>
    </main>
</template>


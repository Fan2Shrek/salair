<script setup lang="ts">
    definePageMeta({
        middleware: 'auth',
    });
    
    const route = useRoute();
</script>

<template>
    <NuxtLayout name="app">
        <main class="h-full w-full pt-8 pb-12">
            <div class="px-8">
                <h1 class="text-2xl font-semibold text-primary mb-6">Modifier la facture</h1>
                <div class="bg-secondary rounded-xl p-6">
                    <p class="text-tertiary">Page de modification de facture en cours de développement.</p>
                    <p class="text-sm text-quaternary mt-2">ID: {{ route.params.id }}</p>
                </div>
            </div>
        </main>
    </NuxtLayout>
</template>


<script setup lang="ts">
    definePageMeta({
        middleware: 'auth',
    });

    const route = useRoute();

    // Récupération du paramètre de duplication
    const duplicateId = computed(() => route.query.duplicate as string | undefined);
</script>

<template>
    <NuxtLayout name="app">
        <main class="h-full w-full pt-8 pb-12">
            <div class="px-8">
                <h1 class="text-2xl font-semibold text-primary mb-6">Créer une facture</h1>
                <div class="bg-secondary rounded-xl p-6">
                    <p class="text-tertiary">Page de création de facture en cours de développement.</p>
                    <div v-if="duplicateId" class="mt-4 p-4 bg-warning/10 rounded-lg">
                        <p class="text-sm text-warning">Duplication de la facture: {{ duplicateId }}</p>
                    </div>
                </div>
            </div>
        </main>
    </NuxtLayout>
</template>

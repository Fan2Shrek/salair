<script setup lang="ts">
    const route = useRoute();
    const _email = ref(route.query.email)
</script>

<template>
    <main class="h-full w-full relative flex flex-col items-center">
        <UGridBackgroundPattern class="absolute -top-2" />
    </main>
</template>

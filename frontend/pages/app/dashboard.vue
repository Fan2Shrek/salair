<script setup lang="ts">
    definePageMeta({
        middleware: 'auth',
    });
</script>

<template>
    <NuxtLayout name="app">
        <main />
    </NuxtLayout>
</template>

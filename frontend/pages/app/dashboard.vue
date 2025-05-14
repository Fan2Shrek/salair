<script setup lang="ts">
    definePageMeta({
        middleware: 'auth',
    });

    useSeoMeta({
        title: 'Dashboard'
    })
</script>

<template>
    <NuxtLayout name="app">
        <main />
    </NuxtLayout>
</template>

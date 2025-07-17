<script setup lang="ts">
    const value = ref(40);


</script>

<template>
    <NuxtLayout name="doc">
        <main class="flex flex-col gap-4 items-center justify-center max-w-6xl mx-auto w-full h-full">
            <UInputNumber v-model="value" :max="100" />

            <UProgress :value="value" :max="100" />
        </main>
    </NuxtLayout>
</template>


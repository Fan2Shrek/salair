<script setup lang="ts">
    const handleFileUpload = (file: File) => {
        console.log('Fichier sélectionné:', file);
        // Traitez le fichier ici
    };
</script>

<template>
    <NuxtLayout name="doc">
        <UFileInput multiple @update:file="handleFileUpload" />
    </NuxtLayout>
</template>


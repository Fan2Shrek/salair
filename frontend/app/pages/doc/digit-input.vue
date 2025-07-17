<template>
    <UDigitsInput
        v-model="verificationCode"
        :length="6"
        :error="hasError"
        error-message="Code invalide"
        @complete="handleCodeComplete"
    />
</template>

<script setup>
    const verificationCode = ref('');
    const hasError = ref(false);

    const handleCodeComplete = (code) => {
        // Vérifier le code
        console.log('Code complet:', code);
    };
</script>

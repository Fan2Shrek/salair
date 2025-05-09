<script setup lang="ts">
    interface StepPasswordProps {
        nextStep?: () => void;
    }

    const props = defineProps<StepPasswordProps>();

    const onboardingStore = useOnboardingStore();

    const password = ref<string>(onboardingStore.password);
    const passwordConfirm = ref<string>('');

    watch([password, passwordConfirm], () => {
        if (password.value === passwordConfirm.value) {
            onboardingStore.password = password.value;
        }
    });

    function handleNextStep() {
        if (password.value === passwordConfirm.value) {
            if (props.nextStep) {
                props.nextStep();
            }
        }
    }
</script>

<template>
    <div class="bg-primary p-3.5 rounded-xl border border-primary shadow-xs h-fit w-fit mx-auto relative">
        <PasscodeIcon class="text-fg-secondary size-7" />
    </div>
    <h2 class="font-semibold text-primary text-3xl mt-8 text-center relative">Mot de passe</h2>
    <p class="text-tertiary text-center mt-3 relative max-w-90">Choisissez un mot de passe sécurisé pour votre compte</p>
    <div class="max-w-90 mx-auto w-full mt-8 space-y-5 relative">
        <UInput
            v-model="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            label="Password"
            class="w-full"
            required
        />
        <UInput
            v-model="passwordConfirm"
            type="password"
            name="passwordConfirm"
            placeholder="Confirm your password"
            label="Confirm password"
            class="w-full"
            required
        />
    </div>
    <UButton class="w-full mt-6" @click="handleNextStep">Continuer</UButton>
</template>


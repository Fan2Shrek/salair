<script setup lang="ts">
    interface StepPasswordProps {
        nextStep?: () => void;
    }

    const props = defineProps<StepPasswordProps>();

    const onboardingStore = useOnboardingStore();
    const authStore = useAuthStore();
    const { error: toastError } = useToast();
    const { t } = useI18n();

    const password = ref<string>(onboardingStore.password);
    const passwordConfirm = ref<string>('');

    watch([password, passwordConfirm], () => {
        if (password.value === passwordConfirm.value) {
            onboardingStore.password = password.value;
        }
    });

    async function handleNextStep() {
        if (password.value === passwordConfirm.value) {
            try {
                const { success, error } = await authStore.register({
                    firstName: onboardingStore.firstName,
                    lastName: onboardingStore.lastName,
                    password: password.value,
                    email: onboardingStore.email,
                });

                if (success) {
                    if (props.nextStep) {
                        props.nextStep();
                    }
                } else {
                    if (error) {
                        toastError(t('general.error_occurred'), error);
                    }
                }
            } catch {
                toastError(t('general.error_occurred'), '');
            }
        }
    }
</script>

<template>
    <div class="bg-primary p-3.5 rounded-xl border border-primary shadow-xs h-fit w-fit mx-auto relative">
        <PasscodeIcon class="text-fg-secondary size-7" />
    </div>
    <h2 class="font-semibold text-primary text-3xl mt-8 text-center relative">{{ t('onboarding.password.title') }}</h2>
    <p class="text-tertiary text-center mt-3 relative max-w-90">
        {{ t('onboarding.password.subtitle') }}
    </p>
    <form class="max-w-90 mx-auto w-full mt-8 space-y-5 relative" @submit.prevent="handleNextStep">
        <UInput
            v-model="password"
            type="password"
            name="password"
            :placeholder="t('onboarding.password.form.password.placeholder')"
            :label="t('onboarding.password.form.password.label')"
            class="w-full"
            required
        />
        <UInput
            v-model="passwordConfirm"
            type="password"
            name="passwordConfirm"
            :placeholder="t('onboarding.password.form.confirm_password.placeholder')"
            :label="t('onboarding.password.form.confirm_password.label')"
            class="w-full"
            required
        />
        <UButton class="w-full mt-6" type="submit">{{ t('general.continue') }}</UButton>
    </form>
</template>


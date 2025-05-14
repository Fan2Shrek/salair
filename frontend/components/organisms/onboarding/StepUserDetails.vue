<script setup lang="ts">
    interface StepUserDetailsProps {
        nextStep?: () => void;
    }

    const props = defineProps<StepUserDetailsProps>();

    const onboardingStore = useOnboardingStore();
    const { error: toastError } = useToast();
    const { $api } = useNuxtApp();

    const firstName = ref<string>(onboardingStore.firstName || '');
    const lastName = ref<string>(onboardingStore.lastName || '');
    const email = ref<string>(onboardingStore.email || '');

    async function handleSubmit() {
        if (firstName.value === '') return;
        if (lastName.value === '') return;
        if (email.value === '') return;

        try {
            const { data, error } = await useAuthFetch<{ exists: boolean; message: string }>($api('/api/check'), {
                method: 'POST',
                body: { email: email.value },
            });

            if (data.value && !error.value) {
                if (data.value.exists) {
                    toastError('The email already exists', data.value.message);
                } else {
                    if (props.nextStep) {
                        await props.nextStep();
                    }
                }
            }
        } catch {
            toastError('An error occured', '');
        }
    }

    watch([firstName, lastName, email], ([newFirstName, newLastName, newEmail]) => {
        if (newFirstName !== undefined) onboardingStore.firstName = newFirstName;
        if (newLastName !== undefined) onboardingStore.lastName = newLastName;
        if (newEmail !== undefined) onboardingStore.email = newEmail;
    });
</script>

<template>
    <div class="bg-primary p-3.5 rounded-xl border border-primary shadow-xs h-fit w-fit mx-auto relative">
        <UserIcon class="text-fg-secondary size-7" />
    </div>
    <h2 class="font-semibold text-primary text-3xl mt-8 text-center relative">Vos informations</h2>
    <p class="text-tertiary text-center mt-3 relative">Entrez votre nom complet et votre adresse email</p>
    <form class="max-w-90 mx-auto w-full mt-8 space-y-5 relative" @submit.prevent="handleSubmit">
        <UInput
            v-model="firstName"
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            label="First name"
            class="w-full"
            required
        />
        <UInput
            v-model="lastName"
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            label="Last name"
            class="w-full"
            required
        />
        <UInput
            v-model="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            label="Email"
            required
            class="w-full"
        />
        <UButton class="w-full mt-6" type="submit">Continuer</UButton>
    </form>
</template>

